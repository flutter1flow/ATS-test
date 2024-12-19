let kv = null;
let url = null;
let hkv = null;

// Utility function to generate time slots
const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
	const [startHour, startMinute] = startTime.split(":").map(Number);
	const [endHour, endMinute] = endTime.split(":").map(Number);
	const slots = [];
	for (let hour = startHour, minute = startMinute; hour < endHour || (hour === endHour && minute <= endMinute);) {
		slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
		minute += intervalMinutes;
		if (minute >= 60) { minute -= 60; hour += 1; }
	}
	return slots;
};

// Utility function to get today's time-slot key
const getSlotKey = (time) => `${new Date().toISOString().split("T")[0]}_${time}`;

// Utility function to get today's calendar message key for a user
const getCalendarKey = (userId) => `${new Date().toISOString().split("T")[0]}_${userId}_calendar_message`;

// Fetch the slot's icon status for a user
const getSlotIcon = async (time, userId, azanIcon) => {
	const users = JSON.parse(await kv.get(getSlotKey(time))) || [];
	const disIcon = "❌", userIcon = "✅", guestIcon = "👤";
	const userStatusIcon = users.includes(userId) ? userIcon : azanIcon === "" ? disIcon : "";
	const guestStatusIcon = users.some((id) => id !== userId) ? guestIcon : "";
	return `${userStatusIcon} ${guestStatusIcon}`.trim();
};

// ========================= TRANSLATE TEXT ENG 2 ARB

// Utility function to translate text to Arabic
const translateToArabic = async (text) => {
	const translationApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(
		text
	)}`;
	try {
		const response = await fetch(translationApiUrl);
		if (response.ok) {
			const translationData = await response.json();
			return translationData[0][0][0]; // Extract translated text
		}
	} catch (error) {
		console.error("Error translating text:", error);
	}
	return text; // Fallback to the original text if translation fails
};

// =========================== QURAN AYAH

const fetchRandomAya = async () => {
	const fahrast = {2:286 , 3 : 200}
	const surh = 2 + Math.floor(Math.random()*2); // temp just for baqrh and al 3emran //TODO
	const aya  = 1 + Math.floor(fahrast[surh]*Math.random());
	//Random aya //TODO
	let ranomAya = `${surh}.json:${aya}.json`;
	//get aya
	const apiUrl = `http://api.alquran.cloud/v1/ayah/${ranomAya}`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) return;

		const data = await response.json();
		if (!data.data || !data.data.text) return;

		const ayah = data.data.text;
		return ayah;

	} catch (error) {
		console.error("Error fetching Aya:", error);
	}

}

// ========================= SUNNAH HADITH

const fetchRandomHadith = async (kvNamespace) => {
	const collectionsAndRanges = [
		{ collection: "bukhari", ranges: [[1, 7563]], kitab: "صحيح البخاري" },
		{ collection: "muslim", ranges: [[1, 7563]], kitab: "صحيح مسلم" },
	];
	const maxHadithLength = 800;

	for (let attempts = 0; attempts < 5; attempts++) {
		const randomCollection = collectionsAndRanges[Math.floor(Math.random() * collectionsAndRanges.length)];
		const randomRange = randomCollection.ranges[Math.floor(Math.random() * randomCollection.ranges.length)];
		const [minHadithNumber, maxHadithNumber] = randomRange;
		const randomHadithNumber = Math.floor(Math.random() * (maxHadithNumber - minHadithNumber + 1)) + minHadithNumber;

		const apiUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${randomCollection.collection}/${randomHadithNumber}.json`;

		try {
			const response = await fetch(apiUrl);
			if (!response.ok) continue;

			const data = await response.json();
			if (!data.hadiths || !data.hadiths[0]?.text) continue;

			const hadith = data.hadiths[0].text;
			const sectionNameEnglish = data.metadata.section ? Object.values(data.metadata.section)[0] : null;
			const sectionNameArabic = sectionNameEnglish ? await translateToArabic(sectionNameEnglish) : "غير محدد";
			const sectionNumber = Object.keys(data.metadata.section || {})[0];
			const formattedHadith = `📜 ${randomHadithNumber}: ${hadith}\n📚 (${randomCollection.kitab} - ${sectionNumber}: ${sectionNameArabic})`;

			if (hadith.length <= maxHadithLength) {
				const key = `${randomCollection.collection}_${randomHadithNumber}`;
				// TODO: save hadith in HKV => await saveHadithToKV(key, formattedHadith);
				return formattedHadith;
			}
		} catch (error) {
			console.error("Error fetching Hadith:", error);
		}
	}

	return "";
};

const saveHadithToKV = async (key, hadithText) => {
	try {
		// Save the Hadith text under the unique key
		await hkv.put(key, hadithText);

		// Update the unified index
		const indexKey = "hadith_keys";
		const currentIndex = JSON.parse(await hkv.get(indexKey) || "[]");
		if (!currentIndex.includes(key)) {
			currentIndex.push(key);
			await hkv.put(indexKey, JSON.stringify(currentIndex));
		}
	} catch (error) {
		console.error("Error saving Hadith to KV:", error);
	}
};

const getRandomHadithFromKV = async () => {
	try {
		// Fetch the index of Hadith keys
		const indexKey = "hadith_keys";
		const currentIndex = JSON.parse(await hkv.get(indexKey) || "[]");

		if (currentIndex.length === 0) {
			return "No Hadiths available in the KV storage.";
		}

		// Pick a random key from the index
		const randomKey = currentIndex[Math.floor(Math.random() * currentIndex.length)];

		// Fetch the corresponding Hadith text
		const hadithText = await hkv.get(randomKey);

		return hadithText || "Hadith not found in storage.";
	} catch (error) {
		console.error("Error fetching random Hadith from KV:", error);
		return "Error fetching Hadith.";
	}
};

// Handler for "/hadith" command
const handleHadithCommand = async (chatId) => {
	const randomHadith = await fetchRandomHadith();
	// TODO: instead using => const randomHadith = await getRandomHadithFromKV();
	await telegramAPI("sendMessage", {
		chat_id: chatId,
		text: randomHadith,
	});
};


// Handler for "/aya" command
const handleAyaCommand = async (chatId) => {
	const randomAya = await fetchRandomAya();
	await telegramAPI("sendMessage", {
		chat_id: chatId,
		text: randomAya,
	});
};

// ========================= AZAN

// Utility function to fetch prayer times for Jerusalem
const getPrayerTimes = async (date) => {
	const azanKey = `azan_${date}`; // Key pattern: azan_<YYYY-MM-DD>
	const cachedAzanTimes = await kv.get(azanKey);

	if (cachedAzanTimes) {
		// If cached times exist, return the parsed JSON
		return JSON.parse(cachedAzanTimes);
	}

	// Fetch prayer times from the Aladhan API
	const response = await fetch(`https://api.aladhan.com/v1/timings/${date}?latitude=31.771959&longitude=35.217018`);
	const data = await response.json();

	if (data.code === 200) {
		// Extract prayer times
		const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;
		const prayerTimes = [Fajr, Dhuhr, Asr, Maghrib, Isha].map((time) => time.slice(0, 5)); // Convert to HH:MM format

		// Cache the prayer times for 24 hours
		await kv.put(azanKey, JSON.stringify(prayerTimes), { expirationTtl: 86400 }); // Cache for 1 day

		return prayerTimes;
	}

	throw new Error("Failed to fetch prayer times");
};

// Utility to check if a time is close to an Azan and return the icon
const getAzanIcon = (slotTime, prayerTimes) => {
	const [slotHour, slotMinute] = slotTime.split(":").map(Number);
	const slotMinutes = slotHour * 60 + slotMinute;

	const isAzan = prayerTimes.some((prayerTime) => {
		const [prayerHour, prayerMinute] = prayerTime.split(":").map(Number);
		const prayerMinutes = prayerHour * 60 + prayerMinute;

		const difference = slotMinutes - prayerMinutes;
		return difference >= -25 && difference <= 15; // Within the range of 25 minutes before to 15 minutes after
	});

	return isAzan ? "🕌" : ""; // Return mosque icon if within range
};

// ===========================

const createInlineKeyboard = async (timeSlots, userId) => {
	const today = new Date().toISOString().split("T")[0];
	const prayerTimes = await getPrayerTimes(today); // Pass the `env` object

	return Promise.all(timeSlots.map(async (time) => {
		const azanIcon = getAzanIcon(time, prayerTimes); // Get the Azan icon for the slot
		const userIcons = await getSlotIcon(time, userId, azanIcon); // Get user-specific icons
		return {
			text: `${time} - ${azanIcon} ${userIcons.trim()}`,
			callback_data: `time_${time}`,
		};
	})).then(buttons =>
		buttons.reduce((rows, button, index) => {
			if (index % 2 === 0) rows.push([]);
			rows[rows.length - 1].push(button);
			return rows;
		}, [])
	);
};

// Generic function to interact with Telegram API
const telegramAPI = async (method, body) => {
	return fetch(`${url}/${method}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
};

// ==========================

// Save message ID in KV storage
const saveCalendarMessage = async (userId, messageId) => {
	const calendarKey = getCalendarKey(userId);
	await kv.put(calendarKey, messageId.toString(), { expirationTtl: 86400 });
};

// Handler for "/show" command
const handleShowCommand = async (chatId) => {
	const timeSlots = generateTimeSlots("10:00", "20:30", 30);
	const inlineKeyboard = await createInlineKeyboard(timeSlots, chatId);

	// Get today's Gregorian date
	const today = new Date();
	const gregorianDate = today.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

	// Get today's Hijri date
	const hijriDate = today.toLocaleDateString('ar-EG-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' });

	// Fetch random Hadith in Arabic
	const randomHadith = await fetchRandomHadith();
	// TODO: instead using => const randomHadith = await getRandomHadithFromKV();

	// Combine dates in the message
	const response = await telegramAPI("sendMessage", {
		chat_id: chatId,
		text: `${gregorianDate}  [ ${hijriDate} ]\n\n${randomHadith}\n\nمن فضلك قم باختيار الأوقات التي تكون فيها متاحا`,
		reply_markup: { inline_keyboard: inlineKeyboard },
	});

	const result = await response.json();
	if (result.ok) {
		await saveCalendarMessage(chatId, result.result.message_id);
	}
};

// end =================================================================

// Utility to update slot users in KV storage
const updateSlotUsers = async (chosenTime, userId) => {
	const slotKey = getSlotKey(chosenTime);
	const users = new Set(JSON.parse(await kv.get(slotKey)) || []);
	const userAdded = !users.has(userId);
	userAdded ? users.add(userId) : users.delete(userId);
	await kv.put(slotKey, JSON.stringify([...users]), { expirationTtl: 86400 });
	return userAdded;
};

// Utility to update the calendar for a specific user
const updateUserCalendar = async (chatId, messageId, userId) => {
	const timeSlots = generateTimeSlots("10:00", "20:30", 30);
	const inlineKeyboard = await createInlineKeyboard(timeSlots, userId);
	await telegramAPI("editMessageReplyMarkup", {
		chat_id: chatId,
		message_id: messageId,
		reply_markup: { inline_keyboard: inlineKeyboard },
	});
};

// Utility to notify all users in a slot
const notifySlotUsers = async (chosenTime, userName, initiatingUserId) => {
	const slotKey = getSlotKey(chosenTime);
	const users = JSON.parse(await kv.get(slotKey)) || [];
	const notificationPromises = [];

	if (users.length === 2 && users.includes(initiatingUserId)) {
		// Positive message: Meeting scheduled
		const notificationMessage = `✅ تم تعيين درس جديد الساعة ${chosenTime} ✅`;
		users.forEach((uid) => {
			notificationPromises.push(
				telegramAPI("sendMessage", {
					chat_id: uid,
					text: notificationMessage,
				})
			);
		});
	} else if (users.length === 1 && !users.includes(initiatingUserId)) {
		// Negative message: Meeting canceled
		const notificationMessage = `🚫 تم إلغاء درس الساعة ${chosenTime} 🚫`;
		[...users, initiatingUserId].forEach((uid) => {
			notificationPromises.push(
				telegramAPI("sendMessage", {
					chat_id: uid,
					text: notificationMessage,
				})
			);
		});
	} else if (users.length === 1 && users.includes(initiatingUserId)) {
		// Notification message: added slot
		const notificationMessage = `👤 تم تحديد وقت متاح الساعة ${chosenTime} 👤`;
		const allUsers = JSON.parse(await kv.get("users")) || [];
		allUsers.forEach((uid) => {
			if (uid !== initiatingUserId) {
				notificationPromises.push(
					telegramAPI("sendMessage", {
						chat_id: uid,
						text: notificationMessage,
					})
				);
			}
		});
	}

	await Promise.all(notificationPromises); // Wait for all notifications to complete
};

// Fetch all calendar message keys for today
const getAllCalendarKeys = async () => {
	const todayPrefix = new Date().toISOString().split("T")[0];
	const keys = await kv.list({ prefix: `${todayPrefix}_`, limit: 1000 });
	return keys.keys.filter((key) => key.name.endsWith("_calendar_message"));
};

// Utility to update all calendars for today (excluding the initiating user)
const updateAllCalendars = async (initiatingUserId) => {
	const calendarKeys = await getAllCalendarKeys();

	const updatePromises = calendarKeys.map(async (key) => {
		const { name: calendarKey } = key;
		const calendarUserId = parseInt(calendarKey.split("_")[1], 10);
		const calendarMessageId = await kv.get(calendarKey);

		if (calendarUserId !== initiatingUserId && calendarMessageId) {
			const timeSlots = generateTimeSlots("10:00", "20:30", 30);
			const inlineKeyboard = await createInlineKeyboard(timeSlots, calendarUserId);
			await telegramAPI("editMessageReplyMarkup", {
				chat_id: calendarUserId,
				message_id: parseInt(calendarMessageId, 10),
				reply_markup: { inline_keyboard: inlineKeyboard },
			});
		}
	});

	await Promise.all(updatePromises); // Wait for all updates to complete
};

// end =================================================================

// =============================
// Handler for callback queries
// =============================

const handleCallbackQuery = async (callbackQuery) => {
	const { message, data, from } = callbackQuery;
	const chatId = message.chat.id;
	const userId = from.id;
	const chosenTime = data.split("_")[1];

	// Get current time in minutes since midnight
	const timezoneOffset = 2 * 60 * 60 * 1000;
	const utcTime = new Date();
	const now = new Date(utcTime.getTime() + timezoneOffset);
	const currentMinutes = now.getHours() * 60 + now.getMinutes();

	// Get chosen time in minutes since midnight
	const [chosenHour, chosenMinute] = chosenTime.split(":").map(Number);
	const chosenMinutes = chosenHour * 60 + chosenMinute;

	// Check if the chosen time is in the past
	if (chosenMinutes < currentMinutes) {
		// Notify the user and prevent further processing
		await telegramAPI("answerCallbackQuery", {
			callback_query_id: callbackQuery.id,
			text: "لا يمكنك تعديل حالة الوقت لأنه في وقت سابق.",
			show_alert: true, // Show a popup to the user
		});
		return;
	}

	// Proceed with updating the slot status
	const userAdded = await updateSlotUsers(chosenTime, userId);
	await updateUserCalendar(chatId, message.message_id, userId);
	await telegramAPI("answerCallbackQuery", { callback_query_id: callbackQuery.id });
	await notifySlotUsers(chosenTime, from.first_name, userId);
	await updateAllCalendars(userId);
};

// end =================================================================

// ============================== Progress tracking system =================================
// This section of code is responsible for validating and saving user progress messages,
// ensuring they are stored with timestamps, and retrieving recent progress for user queries.
// =========================================================================================

const isValidTrackMessage = (message) => {
	const validPrefixes = ["البقرة", "ال عمران"];
	const messageParts = message.trim().split(" ");
	const prefix = messageParts.slice(0, messageParts.length - 1).join(" ");
	let number = messageParts[messageParts.length - 1];

	// Convert localized digits to standard Arabic numerals
	number = number.replace(/[\u0660-\u0669]/g, (digit) => digit.charCodeAt(0) - 0x0660) // Arabic-Indic
		.replace(/[\u06f0-\u06f9]/g, (digit) => digit.charCodeAt(0) - 0x06f0); // Extended Arabic-Indic

	// Check if prefix is valid and the last part is a number
	return validPrefixes.includes(prefix) && !isNaN(number) && Number.isInteger(Number(number));
};


const saveTrackToKV = async (userId, message) => {
	const key = `track_${userId}`;
	try {
		// Fetch the existing list for the user, or initialize an empty array
		const currentMessages = JSON.parse(await kv.get(key) || "[]");

		// Add the new track object to the list
		const newTrack = {
			track: message,
			time: new Date().toISOString(), // Save the current datetime
		};
		currentMessages.push(newTrack);

		// Save the updated list back to KV
		await kv.put(key, JSON.stringify(currentMessages));
	} catch (error) {
		console.error(`Error saving track to KV for user ${userId}:`, error);
	}
};


const handlePrefixedMessage = async (chatId, userId, message) => {
	await saveTrackToKV(userId, message);
	await telegramAPI("sendMessage", {
		chat_id: chatId,
		text: "📊 تم حفظ متابعة التقدم",
	});
};

const handleTrackCommand = async (chatId, userId) => {
	const key = `track_${userId}`;
	try {

		// Fetch the saved messages for the user
		const currentMessages = JSON.parse(await kv.get(key) || "[]");

		// Get the last 3 messages
		const recentMessages = currentMessages.slice(-3).reverse();

		// Format the response
		const labels = ["الأحدث", "السابق", "السابق"];
		const formattedMessages = recentMessages
			.map((item, index) => `${labels[index]}: ${item.track}`)
			.join("\n");

		// Format the response message with bold text
		const responseMessage = formattedMessages ||
			"**📄 لا يوجد محفوظات**\n\n" +
			"لحفظ تقدمك، أرسل:\n" +
			"**اسم السورة + آخر صفحة قرأتها** 📖\n\n" +
			"مثال: **البقرة 25**";

		await telegramAPI("sendMessage", {
			chat_id: chatId,
			text: responseMessage,
			parse_mode: "Markdown", // Enable Markdown formatting
		});

	} catch (error) {

		console.error(`Error fetching track for user ${userId}:`, error);
		await telegramAPI("sendMessage", {
			chat_id: chatId,
			text: "حدث خطأ أثناء عرض التتبع.",
		});

	}
};

// end ==========================================================================================================================

// =========================
//     MAIN FETCH LOGIC
// =========================

export default {
	async fetch(request, env) {
		url = `https://api.telegram.org/bot${env.botToken}`;
		kv = env.KV;
		hkv = env.HKV;


		// Main logic
		const update = await request.json();
		if (update.message?.text === "/show") {
			await handleShowCommand(update.message.chat.id);
		} else if (update.message?.text === "/ayah") {
			await handleAyaCommand(update.message.chat.id);
		} else if (update.message?.text === "/hadith") {
			await handleHadithCommand(update.message.chat.id);
		} else if (update.message?.text === "/track") {
			await handleTrackCommand(update.message.chat.id, update.message.from.id);
		} else if (update.callback_query) {
			await handleCallbackQuery(update.callback_query);
		} else if (isValidTrackMessage(update.message?.text)) {
			await handlePrefixedMessage(update.message.chat.id, update.message.from.id, update.message.text);
		}

		return new Response("OK");
	},

// end ==========================================================================================================================

// ============================
//     SCHEDULER FUNCTION
// ============================

	// cron job
	async scheduled(event, env, ctx) {
		url = `https://api.telegram.org/bot${env.botToken}`;
		kv = env.KV;
		hkv = env.HKV;

		const sendMsgUrl = `${url}/sendMessage`;

		// Utility function to get today's time-slot key
		const getSlotKey = (time) => `${new Date().toISOString().split("T")[0]}_${time}`;

		const timezoneOffset = 2 * 60 * 60 * 1000;
		const utcTime = new Date();
		const currentTime = new Date(utcTime.getTime() + timezoneOffset);



		if ( currentTime.getHours() == 8 ) {
			const allUsers = JSON.parse(await kv.get("users") || []);
			for (const uid of allUsers) {
				await handleShowCommand(uid);
			}
		}

		const nextMinutes = currentTime.getMinutes() < 30 ? 30 : 0;
		const nextHours = nextMinutes === 0 ? (currentTime.getHours() + 1) % 24 : currentTime.getHours();
		const upcomingTime = `${nextHours.toString().padStart(2, "0")}:${nextMinutes.toString().padStart(2, "0")}`;
		const slotKey = getSlotKey(upcomingTime);

		// Step 2: Check if the slot has at least 2 users
		const users = JSON.parse(await kv.get(slotKey)) || [];
		if (users.length < 2) return; // Skip if fewer than 2 users

		// Step 3: Notify all users in the slot
		const notificationMessage = `⏰ تذكير: لديك درس الساعة ${upcomingTime} ⏰`;
		const notificationPromises = users.map((uid) =>
			fetch(sendMsgUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({chat_id: uid, text: notificationMessage}),
			})
		);

		await Promise.all(notificationPromises); // Wait for all notifications to complete
	}

};
