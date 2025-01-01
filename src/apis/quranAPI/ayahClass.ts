
export class AyahClass {


	get surahName(): string {
		return this._surahName;
	}
	get surahNumber(): number {
		return this._surahNumber;
	}
	get ayahNumberInSurah(): number {
		return this._ayahNumberInSurah;
	}
	get ayahNumber(): number {
		return this._ayahNumber;
	}
	get pageNumber(): number {
		return this._pageNumber;
	}
	get text(): string {
		return this._text;
	}

	private readonly _text        	  	: string;
	private readonly _pageNumber        : number;
	private readonly _ayahNumber        : number;
	private readonly _ayahNumberInSurah : number;
	private readonly _surahNumber       : number;
	private readonly _surahName         : string;


	constructor(data : AyahData) {

		//TODO : handel errors and edge cases
		this._text 				= data.text;
		this._pageNumber 		= data.page;
		this._ayahNumber 		= data.number;
		this._surahNumber 		= data.surah.number;
		this._surahName 		= data.surah.name;
		this._ayahNumberInSurah = data.numberInSurah;

	}





	public getFirstNWords(number:number):string{
		//const regex = new RegExp(`^(?:[\\w-]+[^\\w-]+){${number}[\\w-]+`);
		const _listOfStrings : Array<string> = this._text.split(" ");
		if (_listOfStrings.length < number) return "";
		return _listOfStrings.slice(0,number).join(" ");
	}

	// TODO : get Next Ayah ????
	// TODO : get Next N Ayahs ??

}



interface AyahData{
	number: number;
	text: string;
	page : number;
	numberInSurah : number;
	surah: Surah

}

interface Surah{
	name: string;
	number: number;
	numberOfAyahs: number;
}



