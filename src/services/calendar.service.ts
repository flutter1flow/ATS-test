import { inject, singleton } from 'tsyringe';
import { SlotService } from '@services/slot.service';
import { TelegramService } from '@services/telegram.service';
import { Slot } from '@models/slot.model';
import { InlineButton } from '@interfaces/telegram.interface';
import { UserRepository } from '@repositories/user.repository';

@singleton()
export class CalendarService {
	constructor(
		@inject(UserRepository) private userRepository: UserRepository,
		@inject(SlotService) private slotService: SlotService,
		@inject(TelegramService) private telegramService: TelegramService
	) {}

	async generateSlots(): Promise<void> {
		await this.slotService.generateSlots();
	}

	async notifyUsers(): Promise<void> {
		const slots = await this.slotService.getSlots();
		const users = await this.userRepository.getIds();

		await Promise.all(
			users.map(async (userId) => {
				const calendar = this.buildCalendar(userId, slots);
				await this.telegramService.sendMessage(
					userId,
					'١ يناير ٢٠٢٥  [ ٢ رجب ١٤٤٦ هـ ] \n\n 📜 1535: حَدَّثَنَا مُحَمَّدُ بْنُ أَبِي بَكْرٍ، حَدَّثَنَا فُضَيْلُ بْنُ سُلَيْمَانَ، حَدَّثَنَا مُوسَى بْنُ عُقْبَةَ، قَالَ حَدَّثَنِي سَالِمُ بْنُ عَبْدِ اللَّهِ، عَنْ أَبِيهِ ـ رضى الله عنه ـ عَنِ النَّبِيِّ صلى الله عليه وسلم أَنَّهُ رُئِيَ وَهُوَ فِي مُعَرَّسٍ بِذِي الْحُلَيْفَةِ بِبَطْنِ الْوَادِي قِيلَ لَهُ إِنَّكَ بِبَطْحَاءَ مُبَارَكَةٍ‏.‏ وَقَدْ أَنَاخَ بِنَا سَالِمٌ، يَتَوَخَّى بِالْمُنَاخِ الَّذِي كَانَ عَبْدُ اللَّهِ يُنِيخُ، يَتَحَرَّى مُعَرَّسَ رَسُولِ اللَّهِ صلى الله عليه وسلم وَهُوَ أَسْفَلُ مِنَ الْمَسْجِدِ الَّذِي بِبَطْنِ الْوَادِي، بَيْنَهُمْ وَبَيْنَ الطَّرِيقِ وَسَطٌ مِنْ ذَلِكَ‏.‏\n' +
						'📚 (صحيح البخاري - 25: الحج (الحج)) \n\n من فضلك قم باختيار الأوقات التي تكون فيها متاحا',
					calendar
				);
			})
		);
	}

	buildCalendar(userId: number, slots: Slot[]): InlineButton[][] {
		const maxTextLength = Math.max(...slots.map((slot) => slot.time.length + 4));

		return slots.reduce((rows, slot, index) => {
			if (index % 2 === 0) rows.push([]);

			const isCurrentUserIncluded = slot.users.includes(userId);
			const hasOtherUsers = slot.users.some((id) => id !== userId);
			const icons = `${isCurrentUserIncluded ? ' ✅ ' : ' ❌ '}${hasOtherUsers ? ' 👤 ' : ''}`;

			const baseText = `${slot.time} ${icons}`.trim();
			const paddedText = baseText.padEnd(maxTextLength, ' ');

			rows[rows.length - 1].push(TelegramService.createInlineButton(paddedText, slot.time));
			return rows;
		}, [] as InlineButton[][]);
	}
}
