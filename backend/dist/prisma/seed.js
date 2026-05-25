"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
const OPD_DEPARTMENTS = [
    '10012002 - Bangkok Emergency Services',
    '10013407 - Staff Clinic',
    '10013018 - OB & Gyn Unit',
    '10013066 - Medical Oncology Center',
    '10013078 - Lasik Center',
    '10013023 - Orthopedic Surgery',
    '10013010 - Urology Center',
    '10013157 - Cardiothoracic Surgery Center',
    '10013135 - Hearing Center',
    '10013121 - Radiation Oncology Center',
    '10013109 - Cardiac Imaging Lab',
    '10013104 - Non-Invasive Cardiology Lab',
    '10013008 - Chest Center',
    '10013012 - Dental Center',
    '10013345 - BKK Mental Health & Rehab (BMRC)',
    '10013444 - Special Cardiac Center',
    '10013164 - Oncology Imaging Center',
    '10013454 - Bangkok Hip and Knee Center',
    '10013054 - GI & Liver Center',
    '10013128 - Ambulatory Chemotherapy Care Center',
    '10013260 - Bangkok Academy of Sports and Exercise Medicine',
    '10013004 - Allergy & Asthma Center',
    '10013007 - Neurology',
    '10013015 - Medicine Unit',
    '10013174 - Surgical Oncology Center',
    '10013013 - Rehabilitation I',
    '10013098 - Diabetic Clinic',
    '10013019 - Pediatrics Unit',
    '10013122 - AMS Unit',
    '10013147 - Plastic Surgery & Reconstruction',
    '10013009 - Kidney Center',
    '10013006 - Cardiac Center',
    '10013011 - Eye Center',
    '10011013 - International Medical Services',
    '10013005 - Beauty Center',
    '10013017 - Ear Nose Throat Center',
    '10013080 - Breast Center',
    '10013832 - Health Design Center',
    '10013020 - Surgery Unit',
    '10011012 - JMS Unit',
    '10012001 - Emergency Services Department',
    '10013156 - Fertility Clinic',
    '10013185 - Bangkok Spine Academy',
    '10013337 - Bangkok Longevity Center',
];
const IPD_DEPARTMENTS = [
    '10015014 - Neonatal Intensive Care Unit',
    '10014014 - Ward 5TCH (BMRC)',
    '10014088 - Ward 6BIH (WSH)',
    '10015003 - Intensive Care Unit 3',
    '10015001 - Intensive Care Unit 1',
    '10014060 - Ward 5H (Cardiac)',
    '10014062 - Ward 9D (Cardiac)',
    '10015018 - ICCU',
    '10014087 - Ward 16D (Inter)',
    '10014030 - Ward 11D (Surgery)',
    '10014051 - Ward 5W',
    '10014081 - Ward 4I',
    '10014040 - Ward 14D (OB&GYN)',
    '10014035 - Ward 6BIH',
    '10014077 - Ward 4BIH',
    '10014083 - Ward 5I',
    '10015013 - CCU 1-Surgery',
    '10014052 - Ward 6W (BMT)',
    '10014071 - Ward TCH',
    '10015011 - ICU 7 & ICU 8',
    '10014076 - Ward 5BIH-S (Inter)',
    '10014020 - Ward 6D (Pediatrics)',
    '10015002 - CCU 2-Medicine',
    '10014012 - Ward 10D (Med)',
    '10014061 - Ward 6H (Cardiac)',
    '10014050 - Ward 4W',
    '10015044 - Intensive Care Unit 6',
    '10014013 - Ward 12D (Med)',
    '10014078 - Ward 6BIH (Elite)',
];
const OR_DEPARTMENTS = [
    '10015017 - Cardiothoracic Operating Room',
    '10015004 - Operating Room',
    '10015045 - Operating Room (BIH)',
    '10013088 - Cardiac Catheterization Lab',
    '10015005 - Labour Room',
];
function parseDepartment(entry) {
    const match = entry.match(/^(\d+)\s*-\s*(.+)$/);
    if (!match)
        return { code: entry, name: entry };
    return { code: match[1].trim(), name: match[2].trim() };
}
async function main() {
    const allDepts = [];
    for (const d of OPD_DEPARTMENTS) {
        const { code, name } = parseDepartment(d);
        allDepts.push({ code, name, category: 'OPD' });
    }
    for (const d of IPD_DEPARTMENTS) {
        const { code, name } = parseDepartment(d);
        allDepts.push({ code, name, category: 'IPD' });
    }
    for (const d of OR_DEPARTMENTS) {
        const { code, name } = parseDepartment(d);
        allDepts.push({ code, name, category: 'OR' });
    }
    for (const dept of allDepts) {
        await prisma.department.upsert({
            where: { code: dept.code },
            update: { name: dept.name, category: dept.category },
            create: {
                code: dept.code,
                name: dept.name,
                category: dept.category,
                emailRecipients: [],
                emailCc: [],
                emailBcc: [],
            },
        });
    }
    console.log(`Seeded ${allDepts.length} departments`);
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            fullName: 'System Administrator',
            email: 'admin@smarttemp.local',
            role: client_1.Role.ADMIN,
        },
    });
    const userPassword = await bcrypt.hash('User@123', 10);
    const opdDept = await prisma.department.findFirst({ where: { category: 'OPD' } });
    await prisma.user.upsert({
        where: { username: 'user.opd' },
        update: {},
        create: {
            username: 'user.opd',
            password: userPassword,
            fullName: 'OPD User',
            email: 'user.opd@smarttemp.local',
            role: client_1.Role.USER,
            departmentId: opdDept?.id,
        },
    });
    console.log('Seeded users');
    await prisma.formTemplate.upsert({
        where: { code: 'FM-04-PHA-004' },
        update: {},
        create: {
            code: 'FM-04-PHA-004',
            name: 'Medicine Storage Temperature & Humidity Check',
            description: 'Form for checking temperature and humidity of medication storage areas. Normal room temp: 15-24°C, Relative humidity: 30-60%',
            category: client_1.FormCategory.ROOM_TEMPERATURE,
            fields: {
                sections: [
                    {
                        key: 'room',
                        label: 'Room',
                        labelTh: 'ห้อง',
                        fields: [
                            { key: 'temperature', label: 'Temperature (°C)', type: 'number', min: 0, max: 50, required: true },
                            { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, required: true },
                        ],
                    },
                    {
                        key: 'floorStock',
                        label: 'Floor Stock Cabinet',
                        labelTh: 'ตู้เก็บ Floor Stock',
                        fields: [
                            { key: 'temperature', label: 'Temperature (°C)', type: 'number', min: 0, max: 50, required: true },
                            { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, required: true },
                        ],
                    },
                    {
                        key: 'controlledSubstances',
                        label: 'Controlled Substances Cabinet',
                        labelTh: 'ตู้เก็บยา Controlled Substances',
                        fields: [
                            { key: 'temperature', label: 'Temperature (°C)', type: 'number', min: 0, max: 50, required: true },
                            { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, required: true },
                        ],
                    },
                    {
                        key: 'highAlertDrugs',
                        label: 'High Alert Drugs Cabinet',
                        labelTh: 'ตู้เก็บ High Alert Drugs',
                        fields: [
                            { key: 'temperature', label: 'Temperature (°C)', type: 'number', min: 0, max: 50, required: true },
                            { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, required: true },
                        ],
                    },
                    {
                        key: 'emergencyKits',
                        label: 'Emergency Kits (e.g. seizure kit, Heart kit, black box)',
                        labelTh: 'กระเป๋ายาต่างๆ เช่น set กันชัก, Heart kit, black box',
                        fields: [
                            { key: 'temperature', label: 'Temperature (°C)', type: 'number', min: 0, max: 50, required: true },
                            { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, required: true },
                        ],
                    },
                    {
                        key: 'noAcRoom',
                        label: 'Medicine cabinet without AC',
                        labelTh: 'ตู้เก็บยาในห้องผู้ป่วยขณะไม่เปิดเครื่องปรับอากาศ',
                        fields: [
                            { key: 'temperature', label: 'Temperature (°C)', type: 'number', min: 0, max: 50, required: true },
                            { key: 'humidity', label: 'Humidity (%)', type: 'number', min: 0, max: 100, required: true },
                        ],
                    },
                ],
                metadata: {
                    normalTempRange: { min: 15, max: 24 },
                    normalHumidityRange: { min: 30, max: 60 },
                    checkFrequency: 'Monthly',
                    reference: 'FM-04-PHA-004 Rev.4 (8 Aug 2025)',
                },
            },
        },
    });
    await prisma.formTemplate.upsert({
        where: { code: 'FM-02.2-BHQ-003' },
        update: {},
        create: {
            code: 'FM-02.2-BHQ-003',
            name: 'Refrigerator Temperature Log',
            description: 'Daily refrigerator temperature monitoring chart. Normal range: 2-8°C. Check twice daily at 07:00 and 19:00.',
            category: client_1.FormCategory.FRIDGE_TEMPERATURE,
            fields: {
                timeSlots: ['07:00', '19:00'],
                daysInMonth: 31,
                temperatureRange: { min: 2, max: 8 },
                alertThresholds: {
                    high: { value: 8, action: 'Report to department head or shift supervisor and notify BME' },
                    low: { value: 2, action: 'Report to department head or shift supervisor and notify BME' },
                },
                correctiveActionFields: [
                    { key: 'date', label: 'Date', type: 'date' },
                    { key: 'abnormality', label: 'Abnormality Found', labelTh: 'ความผิดปกติที่พบ', type: 'text' },
                    { key: 'corrective_action', label: 'Corrective Action', labelTh: 'วิธีการแก้ไข', type: 'text' },
                    { key: 'performed_by', label: 'Performed By', labelTh: 'ผู้ดำเนินการ', type: 'text' },
                    { key: 'remarks', label: 'Remarks', labelTh: 'หมายเหตุ', type: 'text' },
                ],
                reference: 'FM-02.2-BHQ-003 Rev.3 (1 Nov 2025)',
            },
        },
    });
    console.log('Seeded form templates');
    await prisma.smtpConfig.upsert({
        where: { id: 'default-smtp' },
        update: {},
        create: {
            id: 'default-smtp',
            host: 'smtp.gmail.com',
            port: 587,
            username: '',
            password: '',
            fromEmail: 'noreply@smarttemp.local',
            useTls: true,
        },
    });
    await prisma.cronjobConfig.upsert({
        where: { name: 'daily-submission-check' },
        update: {},
        create: {
            name: 'daily-submission-check',
            cronExpression: '0 12 * * *',
            description: 'Check daily at 12:00 PM if departments have submitted temperature data',
            isEnabled: true,
        },
    });
    console.log('Seeded configs');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map