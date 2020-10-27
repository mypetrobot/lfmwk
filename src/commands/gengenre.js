const Command = require('../handler/Command')
const BotEmbed = require('../classes/BotEmbed')

const style=[
			'apocalyptic',
			'cold',
			'dark',
			'funereal',
			'infernal',
			'ominous',
			'scary',
			'epic',
			'ethereal',
			'futuristic',
			'hypnotic',
			'martial',
			'mechanical',
			'medieval',
			'mysterious',
			'natural',
			'aquatic',
			'desert',
			'forest',
			'rain',
			'tropical',
			'nocturnal',
			'party',
			'pastoral',
			'peaceful',
			'psychedelic',
			'ritualistic',
			'space',
			'spiritual',
			'surreal',
			'suspenseful',
			'tribal',
			'urban',
			'warm',
			'abstract',
			'death',
			'aggressive',
			'uplifting',
			'triumphant',
			'atmospheric',
			'atonal',
			'avant-garde',
			'chaotic',
			'complex',
			'dense',
			'dissonant',
			'eclectic',
			'heavy',
			'lush',
			'melodic',
			'microtonal',
			'minimalistic',
			'noisy',
			'progressive',
			'raw',
			'repetitive',
			'rhythmic',
			'soft',
			'sparse',
			'technical',
			'lo-fi',
			'black',
			'blackened',
			'post',
			'proto',			
			'neo',
			'nu',
			'psych',
			'bro',
			'power',
			'lo-fi',
			'deep',
			'trip',
			'stoner',
			'future',
			'acid',
			'psych',
			'slow',
			'speed',
			'sad',
			'hard',
			'acoustic',
			'minimal',
			'glitch',
			'scream',
			'micro',
			'twee',
			'beach',
			'doom',
			'instrumental',
			'chip',
			'night',
			'day',
			'aggro',
			'euro',
			'void',
			'gore',
			'riot',
			'horror',
			'grave',
			'gothic',
			'prog',
			'liquid',
			'intelligent',
			'brutal',
			'synth',
			'experimental',
			'math',
			'witch',
			'club',
			'plunder',
			'neuro',
			'crust',
			'street',
			'bubblegum',
			'grime',
			'vapor',
			'fuzz',
			'sludge',
			'chamber',
			'filth',
			'war',
			'traditional',
			'groove',
			'chill',
			'terror',
			'surf',
			'contemporary',
			'free',
			'hell',
			'new',
			'psy',
			'crunk',
			'drum',
			'jangle',
			'swamp',
			'art',
			'glam',
			'dream',
			'freak',
			'symphonic',
			'skate'
			]
			
		const base=[
			'pop',
			'rock',
			'punk',
			'jazz',
			'rap',
			'metal',
			'soul',
			'folk',
			'noise',
			'indie',
			'electronic',
			'dance',
			'electro',
			'emo',
			'funk',
			'dub',
			'ambient',
			'drone',
			'country',
			'techno',
			'trap',
			'industrial',
			'house',
			'garage',
			'blues',
			'grind',
			'classical',
			'bass',
			'ska',
			'reggae',
			'electronica',
			'disco'
		]
		const suffix=[
			'wave',
			'gaze',
			'core',
			'step',
			' hop',
			'style',
			'tronica',
			' revival',
			'tech',
			'musik',
			'musique',
			'tone',
			' fusion',
			'bient',
			'clash',
			'beat',
			'phonics'
		]
	function combinewords(word1,word2){
		if((word1=="lo-fi")&&(word2.substr(0, 1)!=" ")){
			word1="lofi"
		}
		if(word1.substr(word1.length-1, 1)==word2.substr(0, 1)){
			return (word1.substr(0,word1.length-1)+word2)
		}
		if(word1.substr(word1.length-2, 2)==word2.substr(0, 2)){
			return (word1.substr(0,word1.length-2)+word2)
		}
		
		return (word1+word2)
				
	}
	
	function randgenre(){
				let genre=""
		let rannumber=Math.floor(Math.random()*10)
		let genre1=""
		let genre2=""
		switch (rannumber) {
			case 0:
				do{
					genre1=base[Math.floor(Math.random()*base.length)]
					genre2=base[Math.floor(Math.random()*base.length)]
				}while(genre1==genre2)
				genre=genre1+"-"+genre2
				break
			case 1:
				genre=combinewords(base[Math.floor(Math.random()*base.length)],suffix[Math.floor(Math.random()*suffix.length)])
				break
			case 2:
				genre=combinewords(style[Math.floor(Math.random()*style.length)],suffix[Math.floor(Math.random()*suffix.length)])
				break
			case 3:
				genre=base[Math.floor(Math.random()*base.length)]+"-"+combinewords(style[Math.floor(Math.random()*style.length)],suffix[Math.floor(Math.random()*suffix.length)])
				break
			case 4:
				let genre1a=""
				let genre2a=""
				do{
					genre1a=style[Math.floor(Math.random()*style.length)]
					genre2a=style[Math.floor(Math.random()*style.length)]
				}while(genre1a==genre2a)
				genre=genre1a+"-"+combinewords(genre2a,suffix[Math.floor(Math.random()*suffix.length)])
				break
			case 5:
				genre=style[Math.floor(Math.random()*style.length)]+"-"+base[Math.floor(Math.random()*base.length)]
				break
			case 6:
				genre=style[Math.floor(Math.random()*style.length)]+" "+combinewords(style[Math.floor(Math.random()*style.length)],"ism")
				break
			case 7:
				genre1=""
				genre2=""
				do{
					genre1=style[Math.floor(Math.random()*style.length)]
					genre2=base[Math.floor(Math.random()*base.length)]
				}while(combinewords(genre1,genre2).length>12)
				genre=combinewords(genre1,genre2)
				break
			case 8:
				genre1=""
				genre2=""
				do{
					genre1=style[Math.floor(Math.random()*style.length)]
					genre2=style[Math.floor(Math.random()*style.length)]
				}while(combinewords(genre1,genre2).length>12)
				genre=combinewords(genre1,genre2)
				break					
			case 9:
				genre1=""
				genre2=""
				do{
					genre1=base[Math.floor(Math.random()*base.length)]
					genre2=base[Math.floor(Math.random()*base.length)]
				}while(combinewords(genre1,genre2).length>12)
				genre=combinewords(genre1,genre2)
				break
		}		
		if(genre.indexOf("eism"!=-1)){
			genre=genre.replace("eism", "ism")
		}
		let mesg=""
		rannumber=Math.floor(Math.random()*2)		
		switch (rannumber) {
			case 0:
				mesg=style[Math.floor(Math.random()*style.length)]+" "+genre
				break
			case 1:
				mesg=genre
				break
		}
		return mesg
	}
	
	function fullgenre(){
		const joiner=[
			'with elements of',
			'meets',
			'blended with',
			'combined with',
			'borrowing elements from',
			'mixed with'
		]
		let gmsg=""
		let randomnumber=Math.floor(Math.random()*2)	
			switch (randomnumber) {
				case 0:
					gmsg=randgenre()+" "+joiner[Math.floor(Math.random()*joiner.length)]+" "+randgenre()
					break
				case 1:
					gmsg=randgenre()
					break
			}
		return gmsg
	}

class GenGenreCommand extends Command {

    constructor() {
        super({
            name: 'generategenre',
            description: 'Generates random genres. They could be real, they could be fake. They\'re usually fake.',
            usage: [
				'generategenre',
				'generategenre <2-10>'
			],
			aliases: ['gengenre','gg'],
			hidden: true
        })
    }

		
	
    async run(client, message, args) {
		if(message.author.id==client.ownerID){
			const sentence=[
				"Anyone have any good {g} recommendations?",
				"There are not enough fans of {g} around here.",
				"Is there a better genre out there than {g}?",
				"People have been sleeping on the entire {g} genre.",
				"I need more {g} music.",
				"You can never have enough {g} music.",
				"Actually {g} is the best genre.",
				"I'm looking for some good {g}.",
				"I haven't heard a {g} band that I haven't liked.",
				"The world needs more {g}.",
				"The best bands all play {g}.",
				"You may like {g}, but I prefer {g2}.",
				"There are too many {g} bands.",
				"Why does everyone like {g}?",
				"Most {g} bands should play {g2} instead.",
				"Sure I like {g}, but most {g} bands would be better off playing {g2}.",
				"Are their any fans of {g} in the building?",
				"I can't find a single decent {g} band.",
				"There's nothing worse than {g}.",
				"All {g} sounds just like {g2}.",
				"When will bands learn that nobody likes {g}?",
				"The music industry killed the entire genre of {g}.",
				"Why does all {g} sound the same?",
				"Why does {g} sound just like {g2}?",
				"Somebody recommend some good {g} please.",
				"I like bands that play {g}, but most fans of {g} suck.",
				"Don't bother listening to {g}.",
				"Post-{g} sounds better than regular {g}.",
				"Has anyone heard any good {g} lately?",
				"I've been listening to a lot of {g} lately.",
				"Fans of {g} are the worst.",
				"Fans of {g} should quit listening to music.",
				"Every time I hear a {g} song, I think I'm listening to {g2}.",
				"I'm so sick of {g}.",
				"All {g} sounds the same.",
				"Every {g} band sounds the same.",
				"Most {g} sounds like {g2}.",
				"I'm so bored of {g}.",
				"Can we talk about {g} for a minute?",
				"The {g} scene is weak.",
				"Can the bands that play {g} just seriously quit playing {g} please?",
				"I can't find a good community of {g} fans anywhere.",
				"I need to go to more {g} shows.",
				"I haven't heard any good {g} in awhile.",
				"What are some good {g} bands?",
				"Where do I start with the {g} genre?",
				"What is the best {g} artist?",
				"Any tips for making {g} at home?",
				"I have a new {g} project, anyone wanna hear it?",
				"I used to make {g}, but now I make {g2} instead.",
				"Ugh, {g} was way better before the posers showed up.",
				"Would you rather listen to {g} or {g2}?",
				"I can't listen to {g} anymore.",
				"Why are people still talking about {g} bands?",
				"I was into {g} music before it was cool.",
				"I only listen to {g} bands now.",
				"I can't listen to {g} music anymore, the whole scene is too commercial now.",
				"It's time to list your favorite {g} bands.",
				"Does anyone else like {g} music?",
				"Why listen to {g} when you can listen to {g2} instead?",
				"Let's talk about the {g} genre for a minute."
			]			
			if (args.length === 0) {
				const mes=sentence[Math.floor(Math.random()*sentence.length)].split("{g}").join(fullgenre()).split("{g2}").join(fullgenre())
				await message.channel.send(mes)
			}else{			
				const gs=parseInt(args[0])
				let description=""
				if((gs<2)||(gs>10)){
					await message.channel.send(fullgenre())				
				}else{
					for(let x=0;x<gs;x++){
						description+=((x+1)+". "+fullgenre())
						if(x<gs-1){
							description+="\n"
						}
					}
					const embed = new BotEmbed(message)
						.setTitle(`${gs} Genres`)
						.setDescription(description)
						//.setThumbnail(checkuser.user.avatarURL)
					await message.channel.send(embed)			
				}
			}
		}
    }

}

module.exports = GenGenreCommand