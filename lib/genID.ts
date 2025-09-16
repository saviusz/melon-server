let lastTime = new Date();
let counter = 0;

/**
 * Generates system-wide unique ID
 * @returns 50 bit number with structure YYMMDDHHmmssiii, where iii is subsequent call in one second
 */
export function generateId() {
  let now = new Date();

  if (now.valueOf() - lastTime.valueOf() >= 1000) {
    lastTime = now;
    counter = 0;
  } else if (counter >= 999) {
    lastTime = new Date(lastTime.valueOf() + 1000);
    counter = 0;
  } else {
    counter++;
  }

  const year = String(lastTime.getUTCFullYear() % 100).padStart(2, "0");
  // Months are, for some reason, indexed in js (start from 0, istead of 1)
  const month = String(lastTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(lastTime.getUTCDate()).padStart(2, "0");
  const hour = String(lastTime.getUTCHours()).padStart(2, "0");
  const minute = String(lastTime.getMinutes()).padStart(2, "0");
  const second = String(lastTime.getSeconds()).padStart(2, "0");
  const iter = String(counter).padStart(3, "0");

  const id = year + month + day + hour + minute + second + iter;
  if (id.length != 15) {
    throw new Error(
      `Generated id with length other than 15: ${id.length} "${id}"`,
    );
  }

  return Number(id);
}
