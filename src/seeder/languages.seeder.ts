import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';

@Injectable()
export class LanguagesSeeder implements Seeder {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {} // @InjectRepository(Language) private languagesRepository: Repository<Language>

  async seed(): Promise<any> {
    // const languages: any[] = [
    //    { id: '1', title: 'AFRIKAANS' },
    // 		{ id: '2', title: 'ALBANÉS' },
    // 		{ id: '3', title: 'ALEMÁN' },
    // 		{ id: '4', title: 'AMHARICO' },
    // 		{ id: '5', title: 'ARABE' },
    // 		{ id: '6', title: 'ARMENIO' },
    // 		{ id: '7', title: 'BENGALI' },
    // 		{ id: '8', title: 'BIELORUSO' },
    // 		{ id: '9', title: 'BIRMANÉS' },
    // 		{ id: '10', title: 'BULGARO' },
    // 		{ id: '11', title: 'CATALAN' },
    // 		{ id: '12', title: 'CHECO' },
    // 		{ id: '13', title: 'CHINO' },
    // 		{ id: '14', title: 'COREANO' },
    // 		{ id: '15', title: 'CROATA' },
    // 		{ id: '16', title: 'DANÉS' },
    // 		{ id: '17', title: 'DARI' },
    // 		{ id: '18', title: 'DZONGKHA' },
    // 		{ id: '19', title: 'ESCOCÉS' },
    // 		{ id: '20', title: 'ESLOVACO' },
    // 		{ id: '21', title: 'ESLOVENIANO' },
    // 		{ id: '22', title: 'ESPAÑOL' },
    // 		{ id: '23', title: 'ESPERANTO' },
    // 		{ id: '24', title: 'ESTONIANO' },
    // 		{ id: '25', title: 'FAROESE' },
    // 		{ id: '26', title: 'FARSI' },
    // 		{ id: '27', title: 'FINLANDÉS' },
    // 		{ id: '28', title: 'FRANCÉS' },
    // 		{ id: '29', title: 'GAELICO' },
    // 		{ id: '30', title: 'GALESE' },
    // 		{ id: '31', title: 'GALLEGO' },
    // 		{ id: '32', title: 'GRIEGO' },
    // 		{ id: '33', title: 'HEBREO' },
    // 		{ id: '34', title: 'HINDI' },
    // 		{ id: '35', title: 'HOLANDÉS' },
    // 		{ id: '36', title: 'HUNGARO' },
    // 		{ id: '37', title: 'INGLÉS' },
    // 		{ id: '38', title: 'INDONESIO' },
    // 		{ id: '39', title: 'INUKTITUT (ESKIMO)' },
    // 		{ id: '40', title: 'ISLANDICO' },
    // 		{ id: '41', title: 'ITALIANO' },
    // 		{ id: '42', title: 'JAPONÉS' },
    // 		{ id: '43', title: 'KHMER' },
    // 		{ id: '44', title: 'KURDO' },
    // 		{ id: '45', title: 'LAO' },
    // 		{ id: '46', title: 'LAPONICO' },
    // 		{ id: '47', title: 'LATVIANO' },
    // 		{ id: '48', title: 'LITUANO' },
    // 		{ id: '49', title: 'MACEDONIO' },
    // 		{ id: '50', title: 'MALAYÉS' },
    // 		{ id: '51', title: 'MALTÉS' },
    // 		{ id: '52', title: 'NEPALI' },
    // 		{ id: '53', title: 'NORUEGO' },
    // 		{ id: '54', title: 'PASHTO' },
    // 		{ id: '55', title: 'POLACO' },
    // 		{ id: '56', title: 'PORTUGUÉS' },
    // 		{ id: '57', title: 'RUMANO' },
    // 		{ id: '58', title: 'RUSO' },
    // 		{ id: '59', title: 'SERBIO' },
    // 		{ id: '60', title: 'SOMALI' },
    // 		{ id: '61', title: 'SUAHILI' },
    // 		{ id: '62', title: 'SUECO' },
    // 		{ id: '63', title: 'TAGALOG-FILIPINO' },
    // 		{ id: '64', title: 'TAJIK' },
    // 		{ id: '65', title: 'TAMIL' },
    // 		{ id: '66', title: 'TAILANDÉS' },
    // 		{ id: '67', title: 'TIBETANO' },
    // 		{ id: '68', title: 'TIGRINIA' },
    // 		{ id: '69', title: 'TONGANÉS' },
    // 		{ id: '70', title: 'TURCO' },
    // 		{ id: '71', title: 'UCRANIANO' },
    // 		{ id: '72', title: 'URDU' },
    // 		{ id: '73', title: 'UZBEKISTANO' },
    // 		{ id: '74', title: 'VASCO' },
    // 		{ id: '75', title: 'VIETNAMES' },
    //     ]
    // Insert into the database.
    //     const language = this.languagesRepository.create(languages);
    //     return this.languagesRepository.insert(language);
  }

  async drop(): Promise<any> {
    //     return this.languagesRepository.delete({});
  }
}
