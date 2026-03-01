import { Motion } from "@capacitor/motion";
import type { AccelSample } from "./types";

export class MotionService {
  private remove?: () => void;

  async start(cb: (s: AccelSample) => void): Promise<void> {
    console.log("MOTION START CALLED");   // 👈 เช็คว่ามาถึงไหม

    const handler = await Motion.addListener("accel", (event) => {
      console.log("RAW EVENT:", event);   // 👈 เช็ค sensor

      const a = event.accelerationIncludingGravity;
      if (!a) return;
      console.log("AY VALUE:", a.y);

      cb({
        ax: a.x ?? 0,
        ay: a.y ?? 0,
        az: a.z ?? 0,
        t: Date.now(),
      });
    });

    this.remove = () => handler.remove();
  }

  async stop(): Promise<void> {
    this.remove?.();
  }
}