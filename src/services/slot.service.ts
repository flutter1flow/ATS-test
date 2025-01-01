import { inject, singleton } from 'tsyringe';
import { SlotRepository } from '@repositories/slot.repository';
import { SLOT_TIMING } from '@constants/slot.constants';
import { ISlot } from '@models/slot.model';

@singleton()
export class SlotService {
	constructor(@inject(SlotRepository) private slotRepository: SlotRepository) {}

	async generateSlots(): Promise<void> {
		const date = this.getCurrentDate();
		const times = this.generateTimes(SLOT_TIMING.START_TIME, SLOT_TIMING.END_TIME, SLOT_TIMING.INTERVAL_MINUTES);
		await Promise.all(times.map((time) => this.slotRepository.save(date, time, [])));
	}

	async getSlots(): Promise<ISlot[]> {
		const date = this.getCurrentDate();
		return await this.slotRepository.getAll(date);
	}

	private generateTimes(startTime: string, endTime: string, intervalMinutes: number): string[] {
		const times: string[] = [];
		let currentTime = this.parseTime(startTime);
		const endTimeMinutes = this.timeToMinutes(endTime);

		while (this.timeToMinutes(currentTime) < endTimeMinutes) {
			times.push(currentTime);
			currentTime = this.incrementTime(currentTime, intervalMinutes);
		}

		return times;
	}

	private getCurrentDate(): string {
		return new Date().toISOString().split('T')[0];
	}

	private timeToMinutes(time: string): number {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	}

	private incrementTime(time: string, minutesToAdd: number): string {
		const totalMinutes = this.timeToMinutes(time) + minutesToAdd;
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
	}

	private parseTime(time: string): string {
		const [hours, minutes] = time.split(':').map(Number);
		if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
			throw new Error(`Invalid time format: ${time}`);
		}
		return time;
	}
}
