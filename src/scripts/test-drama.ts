import { DramaEngine } from "@/modules/simulation/drama.engine";
import { db } from "@/modules/shared/providers/prisma";

async function main() {
    console.log("🔥 Bắt đầu thử nghiệm Drama Engine...");

    // Gọi thử 3 lần (3 bài post)
    await DramaEngine.triggerElitePost();
    console.log("-------------------");
    await DramaEngine.triggerElitePost();
    console.log("-------------------");
    await DramaEngine.triggerElitePost();
}

main()
    .catch(console.error)
    .finally(() => db.$disconnect());