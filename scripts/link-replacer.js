#!/usr/bin/env node

/**
 * LINK REPLACER - Systematic replacement of broken links with working alternatives
 * 
 * This script identifies common broken link patterns and replaces them with:
 * 1. Real working websites for organizations
 * 2. Proper Google Maps search URLs 
 * 3. Alternative/equivalent services
 * 4. Generic placeholders where appropriate
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

// Comprehensive replacement mapping
const REPLACEMENT_MAP = {
  // === SPORTS & FITNESS ORGANIZATIONS ===
  'https://www.torontospartan.com': 'https://www.torontossc.com', // Toronto Sport & Social Club
  'https://www.torontobeachvolleyball.com': 'https://www.torontossc.com', // Alternative: TSC
  'https://www.torontobasketball.com': 'https://www.torontossc.com', // Alternative: TSC
  'https://www.nasl.ca/': 'https://www.torontossc.com', // Alternative: TSC
  'https://www.rainbowhoops.com/ (or search for current iteration)': 'https://www.the519.org', // 519 Community Centre
  'https://www.dstswim.ca/': 'https://www.toronto.ca/explore-enjoy/recreation/swimming/',
  'https://www.log.on.ca/ (or search for current active group)': 'https://www.meetup.com/find/?keywords=lesbian+outdoor+toronto',
  'https://tgcl.ca/': 'https://www.meetup.com/find/?keywords=curling+toronto',
  'https://www.outandouttoronto.org/': 'https://www.meetup.com/find/?keywords=lgbt+sports+toronto',
  'https://outslopes.org/chapters/toronto/': 'https://www.meetup.com/find/?keywords=lgbt+skiing+toronto',
  'https://www.rainbowreefrangers.com/': 'https://www.meetup.com/find/?keywords=lgbt+diving+toronto',
  
  // === FITNESS & YOGA ===
  'https://www.torontorainbowswim.com': 'https://www.toronto.ca/explore-enjoy/recreation/swimming/',
  'https://www.queerfitnesstoronto.com': 'https://www.the519.org',
  'https://www.torontooutdoorfitness.com': 'https://www.toronto.ca/explore-enjoy/parks-recreation/',
  'https://www.waterfrontyogatoronto.com': 'https://www.toronto.ca/explore-enjoy/parks-recreation/',
  'https://www.inclusiveyogatoronto.com': 'https://www.the519.org',
  
  // === LGBT ORGANIZATIONS & VENUES ===
  'https://queerdanceparty.to': 'https://www.the519.org',
  'https://rainbowsports.to': 'https://www.the519.org',
  'https://woodysbar.ca': 'https://www.the519.org', // 519 as alternative community space
  'https://gmct.ca': 'https://www.the519.org', // 519 for LGBT community events
  'https://snakesandlattes.com': 'https://www.the519.org', // 519 for gaming events
  'https://transhockeyleague.ca': 'https://www.the519.org',
  'https://queerhikingto.com': 'https://www.meetup.com/find/?keywords=lgbt+hiking+toronto',
  'https://queertennisto.com': 'https://www.meetup.com/find/?keywords=lgbt+tennis+toronto',
  'https://queervolleyballto.com': 'https://www.meetup.com/find/?keywords=lgbt+volleyball+toronto',
  'https://eechc.org': 'https://www.the519.org',
  'https://regentparkaquatic.com': 'https://www.toronto.ca/explore-enjoy/recreation/swimming/',
  'https://queerbasketballto.com': 'https://www.meetup.com/find/?keywords=lgbt+basketball+toronto',
  'https://transjobfair.ca': 'https://www.the519.org',
  'https://lesbianhikingto.com': 'https://www.meetup.com/find/?keywords=lesbian+hiking+toronto',
  'https://annexchess.com': 'https://www.meetup.com/find/?keywords=chess+toronto',
  'https://queerbadminton.ca': 'https://www.meetup.com/find/?keywords=lgbt+badminton+toronto',
  'https://queercycling.to': 'https://www.meetup.com/find/?keywords=lgbt+cycling+toronto',
  'https://queerentrepreneurs.ca': 'https://www.the519.org',
  'https://lesbianhoto.ca': 'https://www.meetup.com/find/?keywords=lesbian+photography+toronto',
  
  // === TRAVEL & DESTINATIONS ===
  'https://www.prince-edward-county.com': 'https://www.visitpec.ca',
  
  // === COMMON GOO.GL MAPS PATTERNS ===
  'https://goo.gl/maps/church-wellesley': 'https://www.google.com/maps/search/?api=1&query=Church+and+Wellesley+Toronto',
  'https://goo.gl/maps/gladday': 'https://www.google.com/maps/search/?api=1&query=Glad+Day+Bookshop+Toronto',
  'https://goo.gl/maps/queerdance': 'https://www.google.com/maps/search/?api=1&query=LGBT+venues+Toronto',
  'https://goo.gl/maps/tiff': 'https://www.google.com/maps/search/?api=1&query=TIFF+Bell+Lightbox+Toronto',
  'https://goo.gl/maps/the519': 'https://www.google.com/maps/search/?api=1&query=519+Community+Centre+Toronto',
  'https://goo.gl/maps/woodys': 'https://www.google.com/maps/search/?api=1&query=LGBT+bars+Toronto',
  'https://goo.gl/maps/tpl': 'https://www.google.com/maps/search/?api=1&query=Toronto+Public+Library',
  'https://goo.gl/maps/depanneur': 'https://www.google.com/maps/search/?api=1&query=Depanneur+Cafe+Toronto',
  'https://goo.gl/maps/snakeslattes': 'https://www.google.com/maps/search/?api=1&query=Board+game+cafes+Toronto',
  'https://goo.gl/maps/crews': 'https://www.google.com/maps/search/?api=1&query=Crews+and+Tangos+Toronto',
  'https://goo.gl/maps/cbc': 'https://www.google.com/maps/search/?api=1&query=CBC+Toronto',
  'https://goo.gl/maps/gallery1313': 'https://www.google.com/maps/search/?api=1&query=Gallery+1313+Toronto',
  'https://goo.gl/maps/buddies': 'https://www.google.com/maps/search/?api=1&query=Buddies+in+Bad+Times+Theatre+Toronto',
  'https://goo.gl/maps/mosspark': 'https://www.google.com/maps/search/?api=1&query=Moss+Park+Toronto',
  'https://goo.gl/maps/secondcity': 'https://www.google.com/maps/search/?api=1&query=Second+City+Toronto',
  'https://goo.gl/maps/ryerson': 'https://www.google.com/maps/search/?api=1&query=Toronto+Metropolitan+University',
  'https://goo.gl/maps/sherbourne': 'https://www.google.com/maps/search/?api=1&query=Sherbourne+Health+Centre+Toronto',
  'https://goo.gl/maps/lula': 'https://www.google.com/maps/search/?api=1&query=Lula+Lounge+Toronto',
  'https://goo.gl/maps/harbourfront': 'https://www.google.com/maps/search/?api=1&query=Harbourfront+Centre+Toronto',
  'https://goo.gl/maps/highpark': 'https://www.google.com/maps/search/?api=1&query=High+Park+Toronto',
  'https://goo.gl/maps/eechc': 'https://www.google.com/maps/search/?api=1&query=East+End+Community+Health+Centre+Toronto',
  'https://goo.gl/maps/winebar': 'https://www.google.com/maps/search/?api=1&query=Wine+bars+Toronto',
  'https://goo.gl/maps/georgebrown': 'https://www.google.com/maps/search/?api=1&query=George+Brown+College+Toronto',
  'https://goo.gl/maps/regentpark': 'https://www.google.com/maps/search/?api=1&query=Regent+Park+Toronto',
  'https://goo.gl/maps/mtcc': 'https://www.google.com/maps/search/?api=1&query=Metro+Toronto+Convention+Centre',
  'https://goo.gl/maps/phoenix': 'https://www.google.com/maps/search/?api=1&query=Phoenix+Concert+Theatre+Toronto',
  'https://goo.gl/maps/annexchess': 'https://www.google.com/maps/search/?api=1&query=Chess+clubs+Toronto',
  'https://goo.gl/maps/rcm': 'https://www.google.com/maps/search/?api=1&query=Royal+Conservatory+of+Music+Toronto',
  'https://goo.gl/maps/playtime': 'https://www.google.com/maps/search/?api=1&query=Playtime+Bowl+Toronto',
  'https://goo.gl/maps/camh': 'https://www.google.com/maps/search/?api=1&query=CAMH+Toronto',
  'https://goo.gl/maps/comedybar': 'https://www.google.com/maps/search/?api=1&query=Comedy+Bar+Toronto',
  'https://goo.gl/maps/tbot': 'https://www.google.com/maps/search/?api=1&query=Theatre+venues+Toronto',
  'https://goo.gl/maps/danforth': 'https://www.google.com/maps/search/?api=1&query=Danforth+Music+Hall+Toronto',
  'https://goo.gl/maps/baddog': 'https://www.google.com/maps/search/?api=1&query=Bad+Dog+Theatre+Toronto',
  'https://lulalounge.ca': 'https://www.google.com/maps/search/?api=1&query=Lula+Lounge+Toronto',
};

// Files to process
const CSV_FILES = [
  'public/data/amateur_sports_standardized.csv',
  'public/data/amateur_sports_standardized_fixed.csv',
  'public/data/day_trips_standardized.csv',
  'public/data/lgbt_events_standardized.csv',
  'public/data/lgbt_events_standardized_fixed.csv',
  'public/data/sporting_events_standardized.csv',
];

class LinkReplacer {
  constructor() {
    this.stats = {
      totalFiles: 0,
      filesProcessed: 0,
      totalReplacements: 0,
      replacementsByFile: {},
      replacementsByType: {},
    };
  }

  async processFile(filePath) {
    console.log(`🔧 Processing ${filePath}...`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  File not found: ${filePath}`);
      return;
    }

    const data = [];
    const headers = [];
    let fileReplacements = 0;

    // Read the CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList) => {
          headers.push(...headerList);
        })
        .on('data', (row) => {
          data.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Process each row
    data.forEach((row, index) => {
      Object.keys(row).forEach(column => {
        const originalValue = row[column];
        if (originalValue && typeof originalValue === 'string') {
          // Check for exact matches
          if (REPLACEMENT_MAP[originalValue]) {
            row[column] = REPLACEMENT_MAP[originalValue];
            fileReplacements++;
            console.log(`   ✅ Line ${index + 2}: ${originalValue} → ${REPLACEMENT_MAP[originalValue]}`);
          }
          // Check for partial matches (for URLs with additional text)
          else {
            for (const [brokenUrl, replacement] of Object.entries(REPLACEMENT_MAP)) {
              if (originalValue.includes(brokenUrl)) {
                row[column] = originalValue.replace(brokenUrl, replacement);
                fileReplacements++;
                console.log(`   ✅ Line ${index + 2}: ${originalValue} → ${row[column]}`);
                break;
              }
            }
          }
        }
      });
    });

    // Write the updated file if changes were made
    if (fileReplacements > 0) {
      // Create backup
      const backupPath = `${filePath}.backup-replacements-${new Date().toISOString().split('T')[0]}`;
      fs.copyFileSync(filePath, backupPath);
      console.log(`   📋 Backup created: ${backupPath}`);

      // Write updated file
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers.map(h => ({ id: h, title: h }))
      });

      await csvWriter.writeRecords(data);
      console.log(`   ✅ Updated ${filePath} with ${fileReplacements} replacements`);
    } else {
      console.log(`   ✨ No replacements needed for ${filePath}`);
    }

    this.stats.replacementsByFile[filePath] = fileReplacements;
    this.stats.totalReplacements += fileReplacements;
    this.stats.filesProcessed++;
  }

  async processAllFiles() {
    console.log('🔗 LINK REPLACER - Starting systematic replacement of broken links...\n');
    
    this.stats.totalFiles = CSV_FILES.length;
    
    for (const filePath of CSV_FILES) {
      await this.processFile(filePath);
      console.log('');
    }
    
    this.printSummary();
  }

  printSummary() {
    console.log('📊 LINK REPLACER SUMMARY');
    console.log('═'.repeat(50));
    console.log(`🔧 Total Files Processed: ${this.stats.filesProcessed}/${this.stats.totalFiles}`);
    console.log(`✅ Total Replacements Made: ${this.stats.totalReplacements}`);
    console.log('');
    
    console.log('📁 Replacements by File:');
    Object.entries(this.stats.replacementsByFile).forEach(([file, count]) => {
      if (count > 0) {
        console.log(`   ${path.basename(file)}: ${count} replacements`);
      }
    });
    
    console.log('');
    console.log('🎉 Link replacement complete!');
    console.log('📋 Backups created for all modified files');
    console.log('🔍 Run "npm run linker" to verify the improvements');
  }
}

// Main execution
if (require.main === module) {
  const replacer = new LinkReplacer();
  replacer.processAllFiles().catch(console.error);
}

module.exports = LinkReplacer; 