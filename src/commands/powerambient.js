const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')
const { stringify } = require('querystring')
const fetch = require('node-fetch')

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

class PowerAmbientCommand extends Command {

    constructor() {
        super({
            name: 'powerambient',
            usage: ['powerambient'],
            aliases: ['pa'],
			hidden: true
        })
    }
	

	
    async run(client, message, args) {		
		if((message.author.id==client.ownerID)||(message.author.id=="169580880526966784")||(message.author.id=="155342782750261248")||(message.author.id=="631772446529421314")||(message.author.id=="220582871876763648")||(message.author.id=="427755454018355201")||(message.author.id=="536601623862968342")||(message.author.id=="323845586426134531")){
				const council=[
							'mypetrobot',
							'moth',
							'Jess',
							'ea_n',
							'Horizons',
							'Mr_Chris',
							'Ivana__1902',
							'vapor'							
						]
						let word0=[
							'Imagine',
							'Picture',
							'Embrace',
							'Discover',
							'Explore',
							'Immerse yourself in',
							'Inhale',
							'Feel the',
							'Experience',
							'Delve into',
							'Worship',
							'Kneel before',
							'Become enlighted by',
							'Pray at the altar of',
							'Meditate upon',
							'Travel to worlds of',
							'Become one with',
							'Swear allegiance to',
							'Obey',
							'Bow before',
							'Invoke',
							'Call forth',
							'Summon',
							'Plunge deeper into'
						]
						let word1=[
							'transcendent',
							'frozen',
							'ambient',
							'powerful',
							'deep',
							'lush',
							'expansive',
							'dynamic',
							'barren',
							'icy',
							'swollen',
							'swelling',
							'haunting',
							'foggy',
							'dizzying',			
							'contemplative',
							'rumbling',
							'dense',
							'ghostly',
							'elusive',
							'glassy',
							'crystalline',
							'chilling',
							'ethereal',
							'massive',
							'rich',
							'patient',
							'fractured',
							'meditative',
							'resonant',
							'cinematic',
							'hypnotic',
							'mysterious',
							'spacious',
							'cavernous',
							'chilling',
							'extraterrestrial',
							'terrestrial',
							'empyrean',
							'divine',
							'mesmerizing',
							'ancient',
							'digital',
							'supernatural',
							'arcane',
							'forbidden',
							'spiritual',
							'sparkling',
							'glittering',
							'hazy',
							'mutant',
							'shadowy',
							'blurry',
							'dark',
							'rippling',
							'billowing',
							'enchanted',
							'meaty',
							'heavy',
							'ornate',
							'yawning',
							'chasmal',
							'sunken',
							'vast',
							'boundless',
							'immense',
							'impenetrable',
							'cabalistic',
							'unknowable',
							'abstruse',
							'hidden',
							'hallowed',
							'consecrated',
							'unworldly',
							'intense',
							'alien',
							'violent',
							'restful',
							'distant',
							'gargantuan',
							'distorted',
							'crackling',
							'thunderous',
							'active',
							'warped',
							'dusty',
							'aqueous'							
						]
						let word2=[
							'sound',
							'drone',
							'power',
							'aural',
							'aural',
							'sonic',
							'sonic',
							'timbral',
							'timbral',
							'tonal',
							'tonal',
							'auditory',
							'auditory',
							'cosmic',
							'cryptic',
							'enigmatic',
							'layered',
							'haunted',
							'temporal',						
							'acoustic',
							'mystic',						
							'static',
							'auricular',
							'infinite',
							'electroacoustic',
							'radiant',
							'metallic',
							'choral',
							'acoustoelectric',
							'eternal',
							'metaphysical',
							'spectral',
							'phantasmal',
							'holy',
							'intergalactic',
							'apocalyptic',
							'acoustical',
							'seismic',
							'paradoxical',
							'geometric'
						]
						let word3=[
							'space',
							'spaces',
							'ambience',
							'drones',
							'tones',
							'washes',
							'swells',
							'dynamics',
							'layers',
							'fever dreams',
							'voices',
							'timbres',
							'textures',
							'patterns',
							'landscapes',
							'moods',
							'gravity',
							'motion',
							'expanses',
							'soundscapes',
							'presence',
							'energy',
							'rituals',
							'undercurrents',
							'drama',
							'colors',
							'manipulation',
							'shifts',
							'noise',
							'density',
							'weight',
							'atmosphere',
							'volume',
							'hum',
							'vibrations',
							'tonality',
							'reverberation',
							'pulses',
							'shimmer',
							'motifs',
							'haze',
							'forms',
							'themes',
							'bursts',
							'crescendos',
							'surges',
							'ripples',
							'echoes',
							'harmony',
							'silence',
							'tranquility',
							'figures',
							'arrangements',
							'hymns',
							'cacophony',
							'discord',
							'suffocation',
							'spaciousness',
							'feedback',
							'thunderclaps',
							'intensity',
							'lushness',
							'realms',
							'anomalies',
							'aberrations'
						]
						let word4=[
							'blended with',
							'paired with',
							'and',
							'layered with',
							'mixed with',
							'as well as',
							'combined with',
							'punctuated by',
							'enhanced by',
							'running parallel to',
							'tiptoeing beside',
							'skittering beside',
							'enveloped in',
							'surrounded by',
							'wrapped in',
							'engulfed in',
							'wrapped around',
							'mingling with',
							'accompanied by',
							'contrasted by',
							'swimming in',
							'embracing',
							'echoing out from',
							'dividing',
							'swallowing up',
							'exhaling',
							'beckoning'
						]	
			if (args.length === 0) {
				await message.react('🌩')
				let totalmsg=125
				let msgnumber = Math.floor(Math.random() * totalmsg)
				let msg=""
				switch (msgnumber) {
					case 0:
						msg="> Where ambient is apt to wash over you, power ambient demands you pay attention to its constant shifts in mood and intensity."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 1:
						msg="> Played at low volumes it can be quite soothing, but by and large ambient's relaxing qualities don't apply here. This music is altogether harsher and meatier, rough with grit and teeming with motion, even as it keeps much of the space and stillness of ambient music at its heart."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 2:
						msg="> Perhaps you could call it \"power ambient\" - there is force to the music, some of it has certain gravity, but it is not meant to be overpowering."
						msg+="\n- `Chris SSG` *(DJ & Blogger)*"
						break
					case 3:
						msg="> Many of 2014's best \"power ambient\" LPs lay at the intersection of noise, dance music and ambient."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 4:
						msg="> The tones are shimmering, but possibly only from the stream of tears that they evoke."
						msg+="\n- `Andy French` *(Blogger)*"
						break
					case 5:
						msg="> ...shouldered on sustained tones and crackled ozone drones that hit the listener squarely in solar plexus..."
						msg+="\n- `Andy French` *(Blogger)*"
						break
					case 6:
						msg="> Powerful drone-ambient pieces ... all developed methodically and patiently as mysterious, otherworldly rituals."
						msg+="\n- `Eyal Hareuveni` *(Blogger)*"
						break				
					case 7:
						msg="> The sonic textures sound timeless, even static, but patiently more colors and shades are revealed and morph into powerful, dense walls of sounds."
						msg+="\n- `Eyal Hareuveni` *(Blogger)*"
						break
					case 8:
						msg="> ...contemplative and minimalist ambient soundscapes, each with its own subtle, dramatic dynamics."
						msg+="\n- `Eyal Hareuveni` *(Blogger)*"
						break
					case 9:
						msg="> The result is smudged without being indistinct, its filigree detail adding density to its ominous weight rather than detracting from it."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 10:
						msg="> Although \"power ambient\" seems like an oxymoron, it's a useful catchall term for music you could very loosely group with ambient, but that also shares characteristics with extreme styles and dance music, drawing on doom, drone, noise, dub, industrial and techno."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 11:
						msg="> ...temporal manipulation with dense layers of percussion, monumental drones and lashes of noise pitted against a vast expanse of empty space."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 12:
						msg="> ...each piece a riot of abrasive textures, crushing dynamics and thunderous bass."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 13:
						msg="> ...skitter across moods, with nostalgia provided by viscous synths and wan melodies, while deep bass rumbles and sheets of white noise rise that dissolve as rapidly as they rise inject the atmosphere with intense drama."
						msg+="\n- `Maya Kalev` *(Fact Magazine)*"
						break
					case 14:
						msg="https://www.last.fm/tag/power+ambient"		
						break
					case 15:
						msg="https://open.spotify.com/album/0QqlIeJRDX0ZeSpiHPLWxY?si=ngNB81oARvuD1Nrm_-YOkw"		
						break				
					default:

						let rannumber = Math.floor(Math.random() * 3)
						switch (rannumber) {
							case 0:
								msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
								break
							case 1:
								msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]+" "+word4[Math.floor(Math.random() * word4.length)]+" "+word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
								break
							case 2:
								msg=word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
								break
						}
						msg="**"+word0[Math.floor(Math.random() * word0.length)]+" "+msg+".**"
				}
				await message.channel.send(msg)
			}else{				
				await message.react('🌌')
				let validartists=[
					{
						name:'Tim Hecker',
						relic:'\🍭 Staff of Heckfire',
						relicatk: 8,
						relicdef: 0,
						relicintel: 0,
						relicfire: 2,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .6,
						def: .1,
						intel: .3,
						fire: .75,
						earth: .1,
						air: .15,
						water: 0
					},{					
						name:'Gonçalo Penas',
						relic:'\🥀 Thorns of Self-Exorcism',
						relicatk: 5,
						relicdef: 0,
						relicintel: 0,
						relicfire: 0,
						relicearth: 5,
						relicair: 0,
						relicwater: 0,
						atk: .4,
						def: .3,
						intel: .3,
						fire: .1,
						earth: .9,
						air: 0,
						water: 0				
					},{					
						name:'Paul Jebanasam',
						relic:'\📔 Tome of Alien Mathematics',
						relicatk: 0,
						relicdef: 0,
						relicintel: 10,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .2,
						def: 0,
						intel: .8,
						fire: .15,
						earth: 0,
						air: .85,
						water: 0						
					},{					
						name:'Ben Frost',
						relic:'\⛸ Boots of Frostwalking',
						relicatk: 0,
						relicdef: 0,
						relicintel: 0,
						relicfire: 0,
						relicearth: 5,
						relicair: 0,
						relicwater: 5,
						atk: .7,
						def: .2,
						intel: .1,
						fire: 0,
						earth: 0,
						air: 0,
						water: 1
					},{
						name:'Motion Sickness of Time Travel',
						relic:'\💊 Transtemporal Dramamine',
						relicatk: 0,
						relicdef: 5,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .3,
						def: .3,
						intel: .4,
						fire: .25,
						earth: .25,
						air: .25,
						water: .25						
					},{				
						name:'Jefre Cantu-Ledesma',
						relic:'\🏹 Bow Forged of Layered Roots',
						relicatk: 10,
						relicdef: 0,
						relicintel: 0,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .2,
						def: .5,
						intel: .3,
						fire: 0,
						earth: .9,
						air: .1,
						water: 0						
					},{	
						name:'Barnett + Coloccia',
						relic:'\✝ The Crux Conspiro',
						relicatk: 0,
						relicdef: 8,
						relicintel: 2,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .5,
						def: .2,
						intel: .3,
						fire: .2,
						earth: .55,
						air: .1,
						water: .15
					},{
						name:'Lawrence English',
						relic:'\📜 Scroll of the Common Tongue',
						relicatk: 0,
						relicdef: 0,
						relicintel: 10,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .3,
						def: .4,
						intel: .3,
						fire: .1,
						earth: .8,
						air: 0,
						water: .1						
					},{
						name:'Roly Porter',
						relic:'\🍺 Enchanted Ale of Tumbling',
						relicatk: 5,
						relicdef: 5,
						relicintel: 0,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .6,
						def: .3,
						intel: .1,
						fire: .1,
						earth: .5,
						air: .2,
						water: .2						
					},{
						name:'Eric Holm',
						relic:'\🏊 The Diver\'s Lung',
						relicatk: 0,
						relicdef: 0,
						relicintel: 0,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 10,
						atk: .7,
						def: .1,
						intel: .2,
						fire: 0,
						earth: 0,
						air: .15,
						water: .85						
					},{
						name:'Peder Mannerfelt',
						relic:'\⏱ The Hypnotist\'s Pocketwatch',
						relicatk: 0,
						relicdef: 2,
						relicintel: 8,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .5,
						def: .4,
						intel: .1,
						fire: .1,
						earth: .1,
						air: .5,
						water: .3
					},{
						name:'Kangding Ray',
						relic:'\📐 Implements of Far-Eastern Geometry',
						relicatk: 0,
						relicdef: 0,
						relicintel: 10,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .3,
						def: .4,
						intel: .3,
						fire: .2,
						earth: .8,
						air: 0,
						water: 0
					},{
						name:'Koenraad Ecker',
						relic:'\💍 Ring of Paradoxical Silence',
						relicatk: 0,
						relicdef: 5,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .2,
						def: .6,
						intel: .2,
						fire: .25,
						earth: .25,
						air: .25,
						water: .25
					},{
						name:'Ø',
						relic:'\🥄 Null Rod',
						relicatk: 6,
						relicdef: 0,
						relicintel: 4,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .7,
						def: .1,
						intel: .2,
						fire: .25,
						earth: .25,
						air: .25,
						water: .25
					},{
						name:'Killing Sound',
						relic:'\💿 Shard of the Forgotten Format',
						relicatk: 5,
						relicdef: 0,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .8,
						def: .2,
						intel: 0,
						fire: .25,
						earth: .25,
						air: .25,
						water: .25
					},{
						name:'Mike Weis',
						relic:'\🥁 Goblin War Drums',
						relicatk: 10,
						relicdef: 0,
						relicintel: 0,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .5,
						def: .5,
						intel: 0,
						fire: .5,
						earth: .5,
						air: 0,
						water: 0
					},{
						name:'Fennesz',
						relic:'\🌓 Static Orb',
						relicatk: 0,
						relicdef: 0,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 5,
						relicwater: 0,
						atk: .1,
						def: .2,
						intel: .7,
						fire: .15,
						earth: .05,
						air: .75,
						water: .05
					},{
						name:'Evan Caminiti',
						relic:'\🦉 The Drone Wizard\'s Familiar',
						relicatk: 0,
						relicdef: 0,
						relicintel: 7,
						relicfire: 0,
						relicearth: 0,
						relicair: 3,
						relicwater: 0,
						atk: .1,
						def: .7,
						intel: .2,
						fire: .6,
						earth: .2,
						air: .2,
						water: 0
					},{
						name:'Annabelle Playe',
						relic:'\🔔 The Court Jester\'s Bell',
						relicatk: 5,
						relicdef: 0,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .7,
						def: .2,
						intel: .1,
						fire: .6,
						earth: .2,
						air: .2,
						water: 0
					},{
						name:'James Ginzburg',
						relic:'\☁ Nimbostratus Apparatus',
						relicatk: 0,
						relicdef: 0,
						relicintel: 0,
						relicfire: 0,
						relicearth: 0,
						relicair: 10,
						relicwater: 0,
						atk: .1,
						def: .4,
						intel: .5,
						fire: 0,
						earth: 0,
						air: 1,
						water: 0
					},{
						name:'Yair Elazar Glotman',
						relic:'\🎻 Strings of Infinite Sustain',
						relicatk: 0,
						relicdef: 0,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 5,
						relicwater: 0,
						atk: .4,
						def: .5,
						intel: .1,
						fire: 0,
						earth: .8,
						air: 0,
						water: .2
					},{
						name:'Alva Noto',
						relic:'\🧭 Elven Compass',
						relicatk: 0,
						relicdef: 0,
						relicintel: 5,
						relicfire: 0,
						relicearth: 5,
						relicair: 0,
						relicwater: 0,
						atk: .2,
						def: .2,
						intel: .6,
						fire: 0,
						earth: .5,
						air: .5,
						water: 0
					},{
						name:'Joshua Sabin',
						relic:'\🧽 Kerchief of Maximum Absorption',
						relicatk: 0,
						relicdef: 7,
						relicintel: 0,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 3,
						atk: .4,
						def: .4,
						intel: 0,
						fire: 0,
						earth: .3,
						air: .7,
						water: 0
					},{
						name:'Yellow Swans',
						relic:'\🌫️ Wings of Deterioration',
						relicatk: 6,
						relicdef: 0,
						relicintel: 4,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .6,
						def: 0,
						intel: .4,
						fire: .7,
						earth: 0,
						air: .15,
						water: .15
					},{
						name:'Sjellos',
						relic:'\🔮 Power Core of Unearthly Vibrations',
						relicatk: 0,
						relicdef: 7,
						relicintel: 3,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .6,
						def: 0,
						intel: .4,
						fire: 0,
						earth: .45,
						air: .1,
						water: .45
					},{
						name:'C. Diab',
						relic:'\🌊 Wave of Nonexistent Perfection',
						relicatk: 0,
						relicdef: 0,
						relicintel: 5,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 5,
						atk: 0,
						def: .25,
						intel: .75,
						fire: 0,
						earth: 0,
						air: .4,
						water: .6
					},{
						name:'Klara Lewis',
						relic:'\🚩 Rose-Coloured Banner of Resonance',
						relicatk: 0,
						relicdef: 6,
						relicintel:4,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .1,
						def: .7,
						intel: .2,
						fire: 0,
						earth: .2,
						air: .4,
						water: .4
					},{
						name:'Sophia Loizou',
						relic:'\🦋 Cocoon of Artificial Transformation',
						relicatk: 0,
						relicdef: 9,
						relicintel:1,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .3,
						def: .5,
						intel: .2,
						fire: 0,
						earth: .4,
						air: .2,
						water: .4
					},{
						name:'Lumisokea',
						relic:'\⚖️ Balance of Reticence and Impulse',
						relicatk: 0,
						relicdef: 2,
						relicintel:8,
						relicfire: 0,
						relicearth: 0,
						relicair: 0,
						relicwater: 0,
						atk: .3,
						def: .2,
						intel: .5,
						fire: .2,
						earth: .7,
						air: .0,
						water: .1
					}
				]
				let leveltitles=[
					'Neophyte',
					'Novice',
					'Apprentice',
					'Journeyman',
					'Expert',
					'Adept',
					'Master',
					'Grandmaster',
					'Elder',
					'Legendary'
				]
				let wizards=[
					'Wizard',
					'Mage',
					'Clairvoyant',
					'Conjurer',
					'Diviner',
					'Enchanter',
					'Medium',
					'Necromancer',
					'Occultist',
					'Seer',
					'Shaman',
					'Sorcerer',
					'Alchemist',
					'Scholar',
					'Healer',
					'Mystic',
					'Arcanist',
					'Spellcaster',
					'Timelord',
					'Archmage',
					'Druid',
					'Haruspex',
					'Channeller',
					'Psychic',
					'Soothsayer',
					'Prophet',
					'Telepathist',
					'Oracle',
					'Harbinger',
					'Theurgist',
					'Elementalist',
					'Abjurer',
					'Apparitionist',
					'Animist',
					'Augurer',
					'Chronomancer',
					'Cryptomancer',
					'Diabolist',
					'Dowser',
					'Empath',
					'Evoker',
					'Maledict',
					'Mesmerist',
					'Oneiromancer',
					'Runecaster',
					'Ritualist',
					'Scryer'					
				]

				if((args[0].toLowerCase()=='gospel')||(args[0].toLowerCase()=='g')){
						await message.react('📜')
						let num=0
						let msg=""
						let rannumber = Math.floor(Math.random() * 3)
						switch (rannumber) {
							case 0:
								msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
								break
							case 1:
								msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]+" "+word4[Math.floor(Math.random() * word4.length)]+" "+word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
								break
							case 2:
								msg=word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
								break
						}
						let qname=validartists[Math.floor(Math.random() * validartists.length)].name.split(' ')
						msg="*\""+word0[Math.floor(Math.random() * word0.length)]+" "+msg+".\" ("+qname[qname.length-1]+" "+(Math.floor(Math.random() * 39)+1)+":"+(Math.floor(Math.random() * 49)+1)+")*"
					if(args.length>1){
						let chosenartist=parseInt(args[1])-1
						if((chosenartist<0)||(chosenartist>validartists.length-1)){
							await message.channel.send(msg)
							return
						}else{
							switch (rannumber) {
								case 0:
									msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
									break
								case 1:
									msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]+" "+word4[Math.floor(Math.random() * word4.length)]+" "+word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
									break
								case 2:
									msg=word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
									break
							}							
							qname=validartists[chosenartist].name.split(' ')
							msg="*\""+word0[Math.floor(Math.random() * word0.length)]+" "+msg+".\" ("+qname[qname.length-1]+" "+(Math.floor(Math.random() * 39)+1)+":"+(Math.floor(Math.random() * 49)+1)+")*"
							
							const allcrowns = await client.models.crowns.findAll({
								where: {
									guildID: message.guild.id,
									artistName: validartists[chosenartist].name
								}
							})
							let relicowner="no one"
							if (allcrowns.length > 0) {
							   //await message.reply('**'+ message.guild.members.cache.get(allcrowns[0].userID).user.username+'** has the crown for **' + artistName+'** with **'+ allcrowns[0].artistPlays + "** plays.")
							   relicowner= message.guild.members.cache.get(allcrowns[0].userID).user.username
							} 
							let relicplays=""
							try{
								relicplays+=" with "+allcrowns[0].artistPlays+" plays"
							}catch{
							}
							
							const description = "**Relic:** \n"
											  + "`"+validartists[chosenartist].relic+"` \n*(Currently possessed by "+relicowner+relicplays+")*\n\n"
											  + "**Elemental Alignment:**\n"
											  + '`\🌲 '+`${parseInt(validartists[chosenartist].earth*100)}`+'% | \💧 '+`${parseInt(validartists[chosenartist].water*100)}`+'% | \💨 '+`${parseInt(validartists[chosenartist].air*100)}`+'% | \🔥 '+`${parseInt(validartists[chosenartist].fire*100)}`+'%`'
							const embed = new BotEmbed(message)
								.setTitle(`The Gospel of ${validartists[chosenartist].name}`)
								.setDescription(description+'\n\n'+msg)													
							await message.channel.send(embed)
						}
					}else{
						const description = validartists
							//.map(x => `**${x.name}:** `+'`\🌲 '+`${parseInt(x.earth*100)}`+'% | \💧 '+`${parseInt(x.water*100)}`+'% | \💨 '+`${parseInt(x.air*100)}`+'% | \🔥 '+`${parseInt(x.fire*100)}`+'%`')
							.map(x => `${++num}. **${x.name}** `)
							.join('\n')			
						const embed = new BotEmbed(message)
							.setTitle(`The Gospel`)
							.setDescription(description+'\n\n'+msg)													
						await message.channel.send(embed)
					}
				}else{
					let spellicons=[
						'✨', //sparkles
						'☄', //comet
						'⚡', //zap
						'🔥', //fire
						'💥', //boom
						'💫', //dizzy
						'☠', //skullcrossbones
						'❄', //snowflake
						'💨', //dash
						'🌀', //cyclone
						'☢️', //radioactive
						'💠', //diamond shape
						'💢', //anger
						'💮' //white flower
					]
					let levelxp=[]
					for(let z=0;z<=100;z++){
						//levelxp.push(Math.floor(((4 * (Math.pow(z, 2.5)))/5)/6))
						levelxp.push(Math.floor(.3 * Math.pow(z, 2.2)))
					}
					levelxp[2]=1
					
					
					const { bans, users, crowns } = client.models
					let checkuser = message.mentions.members.first()
					const user = await users.findOne({
						where: {
							userID: checkuser.id
						}
					})
					let xp=0
					let mostplays=0
					let affinity="None"
					let inventory=[]
					let elements={fire:0,earth:0,air:0,water:0}
					let stats={atk:0,def:0,intel:0}
					let books=0
					for(let i=0;i<validartists.length;i++){						
						const allcrowns = await client.models.crowns.findAll({
							where: {
								guildID: message.guild.id,
								artistName: validartists[i].name
							}
						})
						
						if (allcrowns.length > 0) {
							
							if( message.guild.members.cache.get(allcrowns[0].userID).user.username==checkuser.user.username){
								//console.log('found crown for '+validartists[i]+' - '+user)
								let statmsg=""
								if(validartists[i].relicatk>0){
									statmsg+='+'+validartists[i].relicatk+' ATK '
								}
								if(validartists[i].relicdef>0){
									statmsg+='+'+validartists[i].relicdef+' DEF '
								}
								if(validartists[i].relicintel>0){
									statmsg+='+'+validartists[i].relicintel+' INT '
								}
								+ '> **Elemental Alignment:**\n> `\🌲 '+elements.earth+' | \💧 '+elements.water+' | \💨 '+elements.air+' | \🔥 '+elements.fire+"`\n"
								if(validartists[i].relicfire>0){
									statmsg+='+'+validartists[i].relicfire+' \🔥 '
								}
								if(validartists[i].relicearth>0){
									statmsg+='+'+validartists[i].relicearth+' \🌲 '
								}
								if(validartists[i].relicwater>0){
									statmsg+='+'+validartists[i].relicwater+' \💧 '
								}
								if(validartists[i].relicair>0){
									statmsg+='+'+validartists[i].relicair+' \💨 '
								}
								statmsg=statmsg.trim()
								inventory.push(validartists[i].relic+' ('+statmsg+')')
								stats.atk+=(validartists[i].relicatk*10)
								stats.def+=(validartists[i].relicdef*10)
								stats.intel+=(validartists[i].relicintel*10)
								elements.fire+=(validartists[i].relicfire*10)
								elements.earth+=(validartists[i].relicearth*10)
								elements.water+=(validartists[i].relicwater*10)
								elements.air+=(validartists[i].relicair*10)							
							}
						}
						
						//console.log('Checking '+validartists[i]+' for '+user.username)
						try{
							let checker=user.username
						}catch{
							await message.react('❌')
							await message.reply("I can't find this user. Is "+checkuser+" logged into me?")
							return
						}
						const params = stringify({
								method: 'artist.getinfo',
								artist: validartists[i].name,
								api_key: client.apikey,
								format: 'json',
								user: user.username
							})
						const data = await fetch(`${client.url}${params}`).then(r => r.json())					
						//console.log(data.artist.stats.userplaycount)
						if(parseInt(data.artist.stats.userplaycount)>parseInt(mostplays)){
							mostplays=data.artist.stats.userplaycount
							affinity=validartists[i].name
						}
						xp+=parseInt(data.artist.stats.userplaycount)
						if(data.artist.stats.userplaycount>=30){
							books=books+1
							//console.log("read" + validartists[i].name + ": "+data.artist.stats.userplaycount)
						}
						elements.fire+=(validartists[i].fire*parseInt(data.artist.stats.userplaycount))
						elements.earth+=(validartists[i].earth*parseInt(data.artist.stats.userplaycount))
						elements.water+=(validartists[i].water*parseInt(data.artist.stats.userplaycount))
						elements.air+=(validartists[i].air*parseInt(data.artist.stats.userplaycount))
						stats.atk+=(validartists[i].atk*parseInt(data.artist.stats.userplaycount))
						stats.def+=(validartists[i].def*parseInt(data.artist.stats.userplaycount))
						stats.intel+=(validartists[i].intel*parseInt(data.artist.stats.userplaycount))
						//console.log('XP: '+xp)
						await sleep(100)
					}
					let gospelbonus=1+((books/validartists.length)/2)
					//console.log(gospelbonus + " : " + parseInt((gospelbonus-1)*100)+"%")
					elements.fire=Math.round((elements.fire/10)*gospelbonus)
					elements.earth=Math.round((elements.earth/10)*gospelbonus)
					elements.water=Math.round((elements.water/10)*gospelbonus)
					elements.air=Math.round((elements.air/10)*gospelbonus)
					stats.atk=Math.round((stats.atk/10)*gospelbonus)
					stats.def=Math.round((stats.def/10)*gospelbonus)
					stats.intel=Math.round((stats.intel/10)*gospelbonus)
					let curlev=0
					for (let z=1;z<levelxp.length;z++){
						if(xp>=levelxp[z]){
							curlev=z
						}
					}
					
					//curlev=1
					/*
					let bonusxp=0
					let lvlcount=curlev
					for (let z=xp;z>0;z--){
						//let tmpxp=xp-levelxp[z]
						if(z>=levelxp[lvlcount]){
							bonusxp=bonusxp+(lvlcount/100)							
						}else{							
							console.log(lvlcount+" - "+bonusxp)
							lvlcount=lvlcount-1
						}
					}
					xp+=Math.round(bonusxp)
					for (let z=1;z<levelxp.length;z++){
						if(xp>=levelxp[z]){
							curlev=z
						}
					}
					*/
					let titlerate=Math.floor(curlev/10)-1
					let yourtitle=""
					if(titlerate<0){
						titlerate=0
						if(curlev==0){
							curlev=1
							yourtitle="Uninitiated"
						}else{						
							yourtitle="Tenderfoot"
						}
					}else{
						if(titlerate>9){titlerate=9}
						yourtitle=leveltitles[titlerate]
					}
					let rating=""
					if (Math.random()>.5){
						rating=yourtitle+" "+capitalize(word1[Math.floor(Math.random() * word1.length)])+" "+capitalize(word2[Math.floor(Math.random() * word2.length)])+" "+wizards[Math.floor(Math.random() * wizards.length)]
					}else{
						rating=yourtitle+" "+wizards[Math.floor(Math.random() * wizards.length)]+" of "+capitalize(word1[Math.floor(Math.random() * word1.length)])+" "+capitalize(word3[Math.floor(Math.random() * word3.length)])
					}
					
					let totalhp=Math.ceil((curlev/100)*200)
					if(totalhp<=0){totalhp=1}
					let curspell="N/A"
					const params = stringify({
							method: 'user.getrecenttracks',
							limit: totalhp,
							api_key: client.apikey,
							format: 'json',
							user: user.username
						})
					const data = await fetch(`${client.url}${params}`).then(r => r.json())	
					let currenthp=0
					let currentmp=0
					let curdate=Math.floor(new Date() / 1000)
					//console.log("CURRENT DATE: "+curdate)
					for(let z=0;z<data.recenttracks.track.length;z++){
						for(let i=0;i<validartists.length;i++){					
							if(data.recenttracks.track[z].artist["#text"]==validartists[i].name){
								
								if(curspell=="N/A"){
									curspell=data.recenttracks.track[z].name
								}
								currentmp=currentmp+1
								let hpadd=0
								try{
									hpadd=1+(Math.ceil((10000-(parseInt(curdate)-parseInt(data.recenttracks.track[z].date.uts)))/1000))
								}catch{
									hpadd=10
								}
								if(hpadd<=1){hpadd=1}
								currenthp=currenthp+hpadd
								//console.log('found '+validartists[i]+' at '+z+' - CURHP: '+currenthp)
								
							}
						}
					}
					totalhp=Math.ceil(totalhp*gospelbonus)
					totalhp=totalhp-1
					if(totalhp<=0){totalhp=1}
					
					let totalmana=Math.ceil((totalhp*1.33)*gospelbonus)
					let currentmana=totalmana-Math.ceil(currentmp*1.33)
					
					if(currentmana<=0){currentmana=0}
					if(currentmana>=totalmana){currentmana=totalmana}
					
					let hpmult=1+((curlev/10)*(curlev/100))				
					//console.log('HP Multipler: '+hpmult+" ("+Math.ceil(currenthp*hpmult)+")")
					
					currenthp=Math.ceil((currenthp*hpmult)*gospelbonus)
					if(currenthp<=1){currenthp=1}
					if(currenthp>=totalhp){currenthp=totalhp}
									
					
					//console.log('HP: '+currenthp+'/'+totalhp)
					//console.log('LEVEL: '+curlev)
					//console.log('Affinity: '+affinity +'('+mostplays+')')
					//console.log('XP Needed: '+(levelxp[curlev+1]-xp))
					
					let description = '**'
					let iscouncil=false
					for(let c=0;c<council.length;c++){
						if(checkuser.user.username==council[c]){
							iscouncil=true
						}
					}
					if(iscouncil){
						description	+=('`🙏` Elder Councilmember '+checkuser.user.username).toUpperCase()
					}else{
						description +=checkuser.user.username.toUpperCase()
					}
						description	+='**\n*The '+rating+'*\n\n'
									  + '> **Level:** '+curlev
									if(curlev!=100){
										description	+= (' *('+(levelxp[curlev+1]-xp)+' XP needed to level up)*')
									}
						description	+='\n'								  
									  
									  + '> **HP:** '+currenthp+'/'+totalhp+' '
									  + '| **MP:** '+currentmana+'/'+totalmana+' '
									  + '| **Total XP:** '+xp+'\n'
									  + '> **ATK:** '+stats.atk+' '
									  + '| **DEF:** '+stats.def+' '
									  + '| **INT:** '+stats.intel+'\n'
									  + '> **Elemental Alignment:**\n> `\🌲 '+elements.earth+' | \💧 '+elements.water+' | \💨 '+elements.air+' | \🔥 '+elements.fire+"`\n"
									  + '> **Gospels Read:** `📚 '+books+'/'+validartists.length+'` (+'+parseInt((gospelbonus-1)*100)+'% scholar bonus)\n'
									  + '> **Allegiance:** '+affinity
									if(affinity!="None"){  
										description	+= ' *('+mostplays+' plays)*'								  
									}								
									if(inventory.length>0){
										description	+= '\n> **Inventory:**\n`'
													+ inventory.join('\n')
													+ '`'
									}
									if(curspell!="N/A"){  
										description	+= '\n\n '+spellicons[Math.floor(Math.random() * spellicons.length)]+' **'+checkuser.user.username+' recently cast a level '+curlev+' "'+curspell+'" spell.**'
									}
						let rannumber = Math.floor(Math.random() * 3)
						let msg=""
							switch (rannumber) {
								case 0:
									msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
									break
								case 1:
									msg=word1[Math.floor(Math.random() * word1.length)]+" "+word2[Math.floor(Math.random() * word2.length)]+" "+word3[Math.floor(Math.random() * word3.length)]+" "+word4[Math.floor(Math.random() * word4.length)]+" "+word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
									break
								case 2:
									msg=word1[Math.floor(Math.random() * word1.length)]+" "+word3[Math.floor(Math.random() * word3.length)]
									break
							}
						let qname=validartists[Math.floor(Math.random() * validartists.length)].name.split(' ')
						msg="*\""+word0[Math.floor(Math.random() * word0.length)]+" "+msg+".\" ("+qname[qname.length-1]+" "+(Math.floor(Math.random() * 39)+1)+":"+(Math.floor(Math.random() * 49)+1)+")*"
						description	+='\n\n'+msg+'\n'
						//+ `\n\n${user.user.username} has **${crowns.length}** crowns in ${message.guild.name}.`
					const embed = new BotEmbed(message)
						.setTitle(`Power Ambience of ${checkuser.user.username}`)
						.setDescription(description)
						.setThumbnail(checkuser.user.avatarURL)
					await message.channel.send(embed)
				}
			}
		}
    }

}

module.exports = PowerAmbientCommand