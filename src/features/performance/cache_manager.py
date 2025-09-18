"""
Intelligent caching system for LifePlanner
"""

import json
import pickle
import hashlib
from typing import Any, Dict, Optional, Callable, Union
from datetime import datetime, timedelta
from pathlib import Path
from functools import wraps
import threading

from ...shared.logging import get_logger


class CacheManager:
    """Intelligent caching system with TTL and memory management"""
    
    def __init__(self, cache_dir: str = "cache", max_memory_mb: int = 100):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.max_memory_bytes = max_memory_mb * 1024 * 1024
        self.logger = get_logger(__name__)
        
        # In-memory cache for frequently accessed items
        self.memory_cache = {}
        self.cache_metadata = {}
        self.access_counts = {}
        self.cache_lock = threading.RLock()
        
        # Load existing cache metadata
        self._load_cache_metadata()
        
        # Cleanup old cache files
        self._cleanup_expired_cache()
    
    def _load_cache_metadata(self):
        """Load cache metadata from disk"""
        metadata_file = self.cache_dir / "cache_metadata.json"
        if metadata_file.exists():
            try:
                with open(metadata_file, 'r') as f:
                    self.cache_metadata = json.load(f)
            except Exception as e:
                self.logger.warning(f"Failed to load cache metadata: {e}")
                self.cache_metadata = {}
    
    def _save_cache_metadata(self):
        """Save cache metadata to disk"""
        metadata_file = self.cache_dir / "cache_metadata.json"
        try:
            with open(metadata_file, 'w') as f:
                json.dump(self.cache_metadata, f, indent=2)
        except Exception as e:
            self.logger.error(f"Failed to save cache metadata: {e}")
    
    def _cleanup_expired_cache(self):
        """Remove expired cache entries"""
        current_time = datetime.now()
        expired_keys = []
        
        with self.cache_lock:
            for key, metadata in self.cache_metadata.items():
                expires_at = datetime.fromisoformat(metadata.get("expires_at", current_time.isoformat()))
                if current_time > expires_at:
                    expired_keys.append(key)
            
            # Remove expired entries
            for key in expired_keys:
                self._remove_cache_entry(key)
        
        if expired_keys:
            self.logger.info(f"Cleaned up {len(expired_keys)} expired cache entries")
    
    def _remove_cache_entry(self, key: str):
        """Remove a cache entry from memory and disk"""
        # Remove from memory
        self.memory_cache.pop(key, None)
        self.access_counts.pop(key, None)
        
        # Remove from metadata
        metadata = self.cache_metadata.pop(key, {})
        
        # Remove file from disk
        cache_file = self.cache_dir / f"{key}.cache"
        if cache_file.exists():
            try:
                cache_file.unlink()
            except Exception as e:
                self.logger.warning(f"Failed to remove cache file {cache_file}: {e}")
    
    def _generate_cache_key(self, *args, **kwargs) -> str:
        """Generate a unique cache key from arguments"""
        # Create a string representation of all arguments
        key_data = {
            "args": args,
            "kwargs": sorted(kwargs.items())
        }
        key_string = json.dumps(key_data, sort_keys=True, default=str)
        
        # Generate hash
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def _manage_memory_usage(self):
        """Manage memory usage by evicting least recently used items"""
        current_memory = sum(len(pickle.dumps(value)) for value in self.memory_cache.values())
        
        if current_memory > self.max_memory_bytes:
            # Sort by access count (LRU)
            sorted_keys = sorted(self.access_counts.items(), key=lambda x: x[1])
            
            # Remove least accessed items until under memory limit
            for key, _ in sorted_keys:
                if current_memory <= self.max_memory_bytes * 0.8:  # Keep some buffer
                    break
                
                if key in self.memory_cache:
                    item_size = len(pickle.dumps(self.memory_cache[key]))
                    del self.memory_cache[key]
                    current_memory -= item_size
                    
                    self.logger.debug(f"Evicted cache key {key} from memory")
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        with self.cache_lock:
            # Check if expired
            if key in self.cache_metadata:
                expires_at = datetime.fromisoformat(self.cache_metadata[key]["expires_at"])
                if datetime.now() > expires_at:
                    self._remove_cache_entry(key)
                    return None
            
            # Try memory cache first
            if key in self.memory_cache:
                self.access_counts[key] = self.access_counts.get(key, 0) + 1
                return self.memory_cache[key]
            
            # Try disk cache
            cache_file = self.cache_dir / f"{key}.cache"
            if cache_file.exists():
                try:
                    with open(cache_file, 'rb') as f:
                        value = pickle.load(f)
                    
                    # Load into memory cache
                    self.memory_cache[key] = value
                    self.access_counts[key] = self.access_counts.get(key, 0) + 1
                    
                    # Manage memory usage
                    self._manage_memory_usage()
                    
                    return value
                except Exception as e:
                    self.logger.warning(f"Failed to load cache file {cache_file}: {e}")
                    self._remove_cache_entry(key)
            
            return None
    
    def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        """Set value in cache with TTL"""
        with self.cache_lock:
            expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
            
            # Store in memory cache
            self.memory_cache[key] = value
            self.access_counts[key] = 1
            
            # Store metadata
            self.cache_metadata[key] = {
                "created_at": datetime.now().isoformat(),
                "expires_at": expires_at.isoformat(),
                "ttl_seconds": ttl_seconds,
                "size_bytes": len(pickle.dumps(value))
            }
            
            # Store on disk
            cache_file = self.cache_dir / f"{key}.cache"
            try:
                with open(cache_file, 'wb') as f:
                    pickle.dump(value, f)
            except Exception as e:
                self.logger.error(f"Failed to save cache file {cache_file}: {e}")
            
            # Manage memory usage
            self._manage_memory_usage()
            
            # Save metadata
            self._save_cache_metadata()
    
    def delete(self, key: str):
        """Delete value from cache"""
        with self.cache_lock:
            self._remove_cache_entry(key)
            self._save_cache_metadata()
    
    def clear(self):
        """Clear all cache entries"""
        with self.cache_lock:
            # Clear memory
            self.memory_cache.clear()
            self.access_counts.clear()
            self.cache_metadata.clear()
            
            # Clear disk
            for cache_file in self.cache_dir.glob("*.cache"):
                try:
                    cache_file.unlink()
                except Exception as e:
                    self.logger.warning(f"Failed to remove cache file {cache_file}: {e}")
            
            self._save_cache_metadata()
        
        self.logger.info("Cleared all cache entries")
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self.cache_lock:
            total_entries = len(self.cache_metadata)
            memory_entries = len(self.memory_cache)
            total_size = sum(metadata.get("size_bytes", 0) for metadata in self.cache_metadata.values())
            
            # Calculate hit rates (would need to track hits/misses for accurate rate)
            total_accesses = sum(self.access_counts.values())
            
            return {
                "total_entries": total_entries,
                "memory_entries": memory_entries,
                "disk_entries": total_entries - memory_entries,
                "total_size_bytes": total_size,
                "total_size_mb": total_size / (1024 * 1024),
                "total_accesses": total_accesses,
                "average_accesses_per_entry": total_accesses / total_entries if total_entries > 0 else 0,
                "memory_usage_mb": sum(len(pickle.dumps(value)) for value in self.memory_cache.values()) / (1024 * 1024)
            }
    
    def cached(self, ttl_seconds: int = 3600, key_prefix: str = ""):
        """Decorator for caching function results"""
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Generate cache key
                func_key = f"{key_prefix}{func.__name__}"
                cache_key = f"{func_key}_{self._generate_cache_key(*args, **kwargs)}"
                
                # Try to get from cache
                cached_result = self.get(cache_key)
                if cached_result is not None:
                    self.logger.debug(f"Cache hit for {func.__name__}")
                    return cached_result
                
                # Execute function and cache result
                result = func(*args, **kwargs)
                self.set(cache_key, result, ttl_seconds)
                
                self.logger.debug(f"Cache miss for {func.__name__}, result cached")
                return result
            
            # Add cache management methods to the wrapper
            wrapper.cache_clear = lambda: self._clear_function_cache(f"{key_prefix}{func.__name__}")
            wrapper.cache_info = lambda: self._get_function_cache_info(f"{key_prefix}{func.__name__}")
            
            return wrapper
        return decorator
    
    def _clear_function_cache(self, func_key: str):
        """Clear cache entries for a specific function"""
        with self.cache_lock:
            keys_to_remove = [key for key in self.cache_metadata.keys() if key.startswith(func_key)]
            for key in keys_to_remove:
                self._remove_cache_entry(key)
            self._save_cache_metadata()
        
        self.logger.info(f"Cleared {len(keys_to_remove)} cache entries for {func_key}")
    
    def _get_function_cache_info(self, func_key: str) -> Dict[str, Any]:
        """Get cache info for a specific function"""
        with self.cache_lock:
            func_keys = [key for key in self.cache_metadata.keys() if key.startswith(func_key)]
            func_accesses = sum(self.access_counts.get(key, 0) for key in func_keys)
            
            return {
                "function": func_key,
                "cache_entries": len(func_keys),
                "total_accesses": func_accesses,
                "memory_entries": len([key for key in func_keys if key in self.memory_cache])
            }


# Global cache instance
cache_manager = CacheManager()


def cached(ttl_seconds: int = 3600, key_prefix: str = ""):
    """Global decorator for caching function results"""
    return cache_manager.cached(ttl_seconds, key_prefix)


def clear_cache():
    """Clear global cache"""
    cache_manager.clear()


def get_cache_stats():
    """Get global cache statistics"""
    return cache_manager.get_cache_stats()

