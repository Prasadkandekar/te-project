/**
 * Script to delete users from the database.
 *
 * Usage:
 *   Delete by email:  node scripts/deleteUsers.js --email user@example.com
 *   Delete by id:     node scripts/deleteUsers.js --id <uuid>
 *   Delete by role:   node scripts/deleteUsers.js --role ENTREPRENEUR
 *   Delete all users: node scripts/deleteUsers.js --all
 *
 * All related records (ideas, bookings, connections, etc.) are cascade-deleted automatically.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const args = process.argv.slice(2);

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

async function main() {
  const email = getArg("--email");
  const id = getArg("--id");
  const role = getArg("--role");
  const deleteAll = args.includes("--all");

  if (!email && !id && !role && !deleteAll) {
    console.error(
      "Provide one of: --email <email> | --id <uuid> | --role <role> | --all"
    );
    process.exit(1);
  }

  let result;

  if (email) {
    result = await prisma.user.delete({ where: { email } });
    console.log(`Deleted user: ${result.name} (${result.email})`);
  } else if (id) {
    result = await prisma.user.delete({ where: { id } });
    console.log(`Deleted user: ${result.name} (${result.id})`);
  } else if (role) {
    const validRoles = ["ENTREPRENEUR", "MENTOR", "ADMIN"];
    if (!validRoles.includes(role.toUpperCase())) {
      console.error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
      process.exit(1);
    }
    result = await prisma.user.deleteMany({ where: { role: role.toUpperCase() } });
    console.log(`Deleted ${result.count} user(s) with role ${role.toUpperCase()}`);
  } else if (deleteAll) {
    result = await prisma.user.deleteMany({});
    console.log(`Deleted all ${result.count} user(s)`);
  }
}

main()
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
