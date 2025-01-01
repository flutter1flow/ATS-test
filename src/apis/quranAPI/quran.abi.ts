
import {AyahClass} from './ayahClass';

export class QuranAbi {
	/*
	!!!! we are using these API link : => https://alquran.cloud/api  <=!!!!!
	 */

	/**
	 *
	 * @param ayah : ex. "2:255","262" Ayat Al Kursi
	 * @return AyahClass
	 */
	public getAyah = async (ayah:string):Promise<AyahClass|null> => {
		const apiUrl = `http://api.alquran.cloud/v1/ayah/${ayah}`;
		try {
			const response = await fetch(apiUrl);
			if (!response.ok) return null;

			const responseJson : OneAyahResponse = await response.json();
			if (!responseJson.data || !responseJson.data.text) return null;

			return new AyahClass(responseJson.data);

		} catch (error) {
			console.error("Error fetching Aya:", error);
			return null;
		}
	}


	/**
	 *
	 * @param surah : ex. 1,2,10,114
	 * @param ayahNumber : ex. 1,2,10,262
	 * @return AyahClass
	 */
	public  getAyahBySurahAndNumber= async (surah:number , ayahNumber:number):Promise<AyahClass|null> =>{
		return this.getAyah(`${surah}:${ayahNumber}`);
	}


	public getFirstAyahInPage = async (pageNumber:number):Promise<AyahClass|null> =>{
		const apiUrl = `http://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani?limit=1`;
		try {
			const response = await fetch(apiUrl);
			if (!response.ok) return null;

			const responseJson : ListOfAyahsResponse = await response.json();
			if (!responseJson.data || !responseJson.data.ayahs || responseJson.data.ayahs.length == 0) return null;

			return new AyahClass(responseJson.data.ayahs[0]);

		} catch (error) {
			console.error("Error fetching Aya:", error);
			return null;
		}

	}


	public getPage = async (pageNumber : number) :Promise<Array<AyahClass>|null> => {
		const apiUrl = `http://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`;
		const ayahsList : Array<AyahClass> = [];
		try {
			const response = await fetch(apiUrl);
			if (!response.ok) return null;

			const responseJson : ListOfAyahsResponse = await response.json();
			if (!responseJson.data || !responseJson.data.ayahs || responseJson.data.ayahs.length == 0) return null;

			for (let index = 0; index < responseJson.data.ayahs.length; index++) {
				ayahsList.push(new AyahClass(responseJson.data.ayahs[index])) //TODO : use factory implement
			}
			return ayahsList;

		} catch (error) {
			console.error("Error fetching Aya:", error);
			return null;
		}
	}

	// TODO : get ayahs
	// TODO : get pages
	// TODO : get surah
	// TODO : search in the text // add feature of text for it
	// TODO :



}


/**
 * @ListOfAyahsResponse:is local for quran API and related to the API we
 * 						use And it should be change if we move to another API
 */
interface ListOfAyahsResponse{
	status : string;
	code : number;
	data : ListOfAyahs;
}
interface ListOfAyahs{
	ayahs : Array<AyahData>;
}


/**
 *
 */
interface OneAyahResponse{
	//TODO : add all the fields in the API ??
	status : string;
	code : number;
	data : AyahData;
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








