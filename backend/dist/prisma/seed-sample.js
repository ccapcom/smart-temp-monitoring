"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TARGET_DEPT_CODES = [
    '10013006',
    '10013015',
    '10015001',
    '10014060',
    '10015004',
];
const MONTHS = [
    { year: 2025, month: 3 },
    { year: 2025, month: 4 },
    { year: 2025, month: 5 },
];
const SEED_TAG = '[SEED-SAMPLE]';
function rand(seed, min, max) {
    const x = Math.sin(seed) * 10000;
    const t = x - Math.floor(x);
    return Math.round((min + t * (max - min)) * 10) / 10;
}
function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
function date(year, month, day, hour = 8) {
    return new Date(year, month - 1, day, hour, 0, 0);
}
const ROOM_LOCATIONS = [
    { key: 'room', label: 'Room' },
    { key: 'floorStock', label: 'Floor Stock Cabinet' },
    { key: 'controlledSubstances', label: 'Controlled Substances Cabinet' },
    { key: 'highAlertDrugs', label: 'High Alert Drugs Cabinet' },
    { key: 'emergencyKits', label: 'Emergency Kits' },
    { key: 'noAcRoom', label: 'Medicine Cabinet (No AC)' },
];
const ROOM_BASE = {
    room: { tempMin: 19, tempMax: 23, humMin: 45, humMax: 55 },
    floorStock: { tempMin: 20, tempMax: 23, humMin: 44, humMax: 54 },
    controlledSubstances: { tempMin: 19, tempMax: 22, humMin: 42, humMax: 52 },
    highAlertDrugs: { tempMin: 19, tempMax: 22, humMin: 42, humMax: 52 },
    emergencyKits: { tempMin: 20, tempMax: 24, humMin: 45, humMax: 58 },
    noAcRoom: { tempMin: 23, tempMax: 27, humMin: 55, humMax: 70 },
};
const ABNORMAL_THRESHOLD_ROOM = { temp: 24, humidity: 60 };
async function seedRoomTemperature(deptId, deptIdx, templateId, submittedById) {
    for (const { year, month } of MONTHS) {
        const formData = {};
        const records = [];
        for (let li = 0; li < ROOM_LOCATIONS.length; li++) {
            const loc = ROOM_LOCATIONS[li];
            const base = ROOM_BASE[loc.key];
            const seed = deptIdx * 1000 + month * 100 + li * 10 + year;
            const tempOffset = rand(seed + 1, -0.5, 0.5);
            const temp = rand(seed, base.tempMin, base.tempMax) + tempOffset;
            const hum = rand(seed + 2, base.humMin, base.humMax);
            const isAbnormal = temp > ABNORMAL_THRESHOLD_ROOM.temp || hum > ABNORMAL_THRESHOLD_ROOM.humidity;
            formData[loc.key] = { temperature: temp, humidity: hum };
            records.push({
                location: loc.label,
                recordDate: date(year, month, 1),
                timeSlot: '08:00',
                temperature: temp,
                humidity: hum,
                isAbnormal,
            });
        }
        await prisma.formSubmission.create({
            data: {
                templateId,
                departmentId: deptId,
                submittedById,
                recordDate: date(year, month, 1),
                data: formData,
                remarks: `${SEED_TAG} room-temp ${year}-${String(month).padStart(2, '0')}`,
                records: { createMany: { data: records } },
            },
        });
    }
}
const FRIDGE_LOCATIONS = ['Fridge 1', 'Fridge 2'];
const FRIDGE_TIME_SLOTS = ['07:00', '19:00'];
const NORMAL_FRIDGE = { min: 2, max: 8 };
const ABNORMAL_FRIDGE_DAYS = {
    0: [5, 18],
    1: [3, 22],
    2: [10, 25],
    3: [7, 20],
    4: [14, 28],
};
async function seedFridgeTemperature(deptId, deptIdx, templateId, submittedById) {
    for (const { year, month } of MONTHS) {
        const totalDays = daysInMonth(year, month);
        const abnormalDays = new Set(ABNORMAL_FRIDGE_DAYS[deptIdx] ?? []);
        const records = [];
        for (let day = 1; day <= totalDays; day++) {
            const isAbnormalDay = abnormalDays.has(day);
            for (const fridgeLoc of FRIDGE_LOCATIONS) {
                const fridgeIdx = FRIDGE_LOCATIONS.indexOf(fridgeLoc);
                for (const slot of FRIDGE_TIME_SLOTS) {
                    const slotIdx = FRIDGE_TIME_SLOTS.indexOf(slot);
                    const hour = slot === '07:00' ? 7 : 19;
                    const seed = deptIdx * 10000 + month * 1000 + day * 100 + fridgeIdx * 10 + slotIdx;
                    let temp;
                    let isAbnormal = false;
                    let remarks = null;
                    if (isAbnormalDay && fridgeIdx === 0) {
                        temp = rand(seed, 8.5, 10.5);
                        isAbnormal = true;
                        remarks = 'แจ้ง BME เพื่อตรวจสอบ — อุณหภูมิเกิน 8°C';
                    }
                    else {
                        temp = rand(seed, 3.0, 7.5);
                        if (slot === '19:00')
                            temp = Math.round((temp + rand(seed + 99, 0, 0.8)) * 10) / 10;
                    }
                    records.push({
                        location: fridgeLoc,
                        recordDate: date(year, month, day, hour),
                        timeSlot: slot,
                        temperature: temp,
                        humidity: null,
                        isAbnormal,
                        remarks,
                    });
                }
            }
        }
        await prisma.formSubmission.create({
            data: {
                templateId,
                departmentId: deptId,
                submittedById,
                recordDate: date(year, month, 1),
                data: { month: `${year}-${String(month).padStart(2, '0')}`, fridges: FRIDGE_LOCATIONS },
                remarks: `${SEED_TAG} fridge-temp ${year}-${String(month).padStart(2, '0')}`,
                records: { createMany: { data: records } },
            },
        });
    }
}
async function main() {
    console.log('🧹  Clearing previous seed-sample data...');
    const prevSubmissions = await prisma.formSubmission.findMany({
        where: { remarks: { contains: SEED_TAG } },
        select: { id: true },
    });
    if (prevSubmissions.length) {
        await prisma.temperatureRecord.deleteMany({
            where: { submissionId: { in: prevSubmissions.map((s) => s.id) } },
        });
        await prisma.formSubmission.deleteMany({
            where: { id: { in: prevSubmissions.map((s) => s.id) } },
        });
        console.log(`   ลบ ${prevSubmissions.length} submissions เดิมออก`);
    }
    const departments = await prisma.department.findMany({
        where: { code: { in: TARGET_DEPT_CODES } },
        orderBy: { code: 'asc' },
    });
    if (departments.length === 0) {
        throw new Error('ไม่พบ departments — รัน seed.ts หลักก่อน: npx ts-node prisma/seed.ts');
    }
    console.log(`📋  พบ ${departments.length}/${TARGET_DEPT_CODES.length} departments`);
    const [roomTemplate, fridgeTemplate] = await Promise.all([
        prisma.formTemplate.findFirst({ where: { code: 'FM-04-PHA-004' } }),
        prisma.formTemplate.findFirst({ where: { code: 'FM-02.2-BHQ-003' } }),
    ]);
    if (!roomTemplate || !fridgeTemplate) {
        throw new Error('ไม่พบ form templates — รัน seed.ts หลักก่อน: npx ts-node prisma/seed.ts');
    }
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin)
        throw new Error('ไม่พบ admin user — รัน seed.ts หลักก่อน');
    let roomCount = 0;
    let fridgeCount = 0;
    for (let i = 0; i < departments.length; i++) {
        const dept = departments[i];
        console.log(`\n🏥  [${i + 1}/${departments.length}] ${dept.name} (${dept.code})`);
        await seedRoomTemperature(dept.id, i, roomTemplate.id, admin.id);
        roomCount += MONTHS.length;
        console.log(`   ✅  Room temp: ${MONTHS.length} submissions (${MONTHS.length * ROOM_LOCATIONS.length} records)`);
        await seedFridgeTemperature(dept.id, i, fridgeTemplate.id, admin.id);
        fridgeCount += MONTHS.length;
        const totalFridgeRecords = MONTHS.reduce((acc, { year, month }) => {
            return acc + daysInMonth(year, month) * FRIDGE_LOCATIONS.length * FRIDGE_TIME_SLOTS.length;
        }, 0);
        console.log(`   ✅  Fridge temp: ${MONTHS.length} submissions (~${totalFridgeRecords} records)`);
    }
    const totalRecords = await prisma.temperatureRecord.count();
    const totalSubs = await prisma.formSubmission.count();
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Seed sample เสร็จสิ้น

   📊  FormSubmission:      ${roomCount + fridgeCount * departments.length} รายการ
   🌡️   TemperatureRecord:   ${totalRecords} รายการ (ทั้งหมดใน DB)
   🏥  Department:          ${departments.length} แผนก
   📅  ช่วงเวลา:            มีนาคม – พฤษภาคม 2025

   ⚠️   มีค่าผิดปกติ (isAbnormal=true) แทรกไว้ให้กราฟน่าสนใจ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-sample.js.map