import { indexComptrollerEvents } from "./comptoller";
import { indexCTokenEvents } from "./ctoken";

export async function indexChain() {
  while (1) {
    // comptroller
    await indexComptrollerEvents();

    // cToken
    await indexCTokenEvents();
    console.log("LOOP")
  }
}

