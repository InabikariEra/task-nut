import bcrypt from "bcryptjs";

const password = process.argv[2] ?? "123456";
console.log(await bcrypt.hash(password, 12));
