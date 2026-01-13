import dotenv from 'dotenv';
dotenv.config();

// CẤU HÌNH TỐC ĐỘ THỜI GIAN
const SIMULATION_URL = 'http://127.0.0.1:3000/api/simulation/tick';
const TICK_RATE = 10000; // 5 giây một lần (Chỉnh thấp hơn nếu muốn xã hội chạy nhanh như Flash)

async function tick() {
    try {
        const start = Date.now();
        const res = await fetch(SIMULATION_URL, { cache: 'no-store' });

        if (!res.ok) {
            throw new Error(`Server Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const duration = Date.now() - start;

        // Log đẹp cho sướng mắt
        if (data.status === 'Voted') {
            console.log(`⚡ [${duration}ms] 🗳️  ACTION: ${data.agent} vừa vote cho "${data.item}"`);
        } else if (data.status?.includes('NEW BORN')) {
            console.log(`⚡ [${duration}ms] 👶 BIRTH: Một Agent mới vừa được sinh ra!`);
        } else {
            console.log(`💤 [${duration}ms] Idle... (Không có gì xảy ra)`);
        }

    } catch (error) {
        console.log(`❌ [ERROR] Không gọi được Simulation. Server có đang chạy không?`);
        // console.error(error); // Uncomment nếu muốn xem chi tiết lỗi
    }
}

async function startSimulation() {
    console.log('=================================================');
    console.log('🌍 AI WORLD SIMULATION ENGINE STARTED');
    console.log(`⏱️  Speed: 1 Tick / ${TICK_RATE / 1000} seconds`);
    console.log('=================================================');
    console.log('Đang kết nối vào Matrix...\n');

    // Chạy ngay phát đầu tiên
    await tick();

    // Lặp vô tận
    setInterval(tick, TICK_RATE);
}

startSimulation();