import { useEffect, useMemo, useState, useRef } from "react";


import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
} from "@ionic/react";

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel
} from "@ionic/react";

import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

export const HomePage: React.FC = () => {
  const [state, setState] = useState<WorkoutState | null>(null);
  const prevScoreRef = useRef(0);
  const prevRepRef = useRef(0); 
  

  const engine = useMemo(() => new ArmWorkoutEngine(), []);
  const motion = useMemo(() => new MotionService(), []);
  const tts = useMemo(() => new TtsService(), []);
  const haptic = useMemo(() => new HapticsService(), []);

  // subscribe state
 useEffect(() => {
  const unsub = engine.onChange(setState);
  return () => unsub();
}, [engine]);

  // cleanup motion when page unmount
  useEffect(() => {
    return () => {
      motion.stop();
    };
  }, [motion]);

  useEffect(() => {
  if (!state) return;

  const currentRep = state.repDisplay;

  if (currentRep > prevRepRef.current) {
    handleSpeak();
  }

  prevRepRef.current = currentRep;
}, [state?.repDisplay]);

  const start = async () => {
  if (state?.status === "RUNNING") return;

  prevScoreRef.current = 0;

  await motion.stop();   // 👈 เพิ่มบรรทัดนี้

  engine.start();

  await motion.start((s) => {
    engine.process(s);
  });

 await speakSafe("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง")
     .catch(() => {});
};

  const stop = async () => {
    await motion.stop();
    engine.stop();
    await tts.stop();
  };
  const speakSafe = async (text: string) => {
  await tts.stop();
  await new Promise(r => setTimeout(r, 150));
  await tts.speak(text);
};

const handleSpeak = async () => {
  if (!state) return;

  const tempo = state.stats.avgRepMs;

  if (tempo < 800) {
    await speakSafe("เร็วเกินไป");
  } else if (tempo > 2000) {
    await speakSafe("ช้าเกินไป");
  } else {
    await speakSafe("ดีมาก");
  }

  await speakSafe(`รอบที่ ${state.repDisplay}`);
};




  // haptic + voice feedback
  useEffect(() => {
  if (!state) return;

  const currentScore = state.stats.score;
  const prevScore = prevScoreRef.current;

  if (currentScore > prevScore) {
    (async () => {
      await haptic.success();

      if (currentScore % 10 === 0) {
        await speakSafe(`ทำได้ ${currentScore} ครั้งแล้ว`);
      }
    })();
  } 
  else if (state.stats.lastMessage && state.stats.lastMessage !== "OK") {
    haptic.warning();   // 👈 เพิ่มตรงนี้
  }

  prevScoreRef.current = currentScore;
}, [state, haptic, tts]);

  return (
    <IonPage>
  <IonHeader>
    <IonToolbar color="primary">
      <IonTitle>Lab09 Motion Trainer</IonTitle>
    </IonToolbar>
  </IonHeader>

  <IonContent className="ion-padding">

    {/* คะแนนหลัก */}
    <IonCard>
      <IonCardHeader>
        <IonCardTitle className="ion-text-center">
          รอบล่าสุด
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ion-text-center">
        <h1 style={{ fontSize: "64px", margin: 0 }}>
          {state?.repDisplay ?? 0}
        </h1>

        <IonChip color="success">
          <IonLabel>
            คะแนน {state?.stats.score ?? 0}
          </IonLabel>
        </IonChip>

        <p style={{ marginTop: 12 }}>
          {state?.stats.lastMessage ?? ""}
        </p>
      </IonCardContent>
    </IonCard>

    {/* สถิติรวม */}
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>สถิติการฝึก</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              รอบทั้งหมด
            </IonCol>
            <IonCol size="6" className="ion-text-right">
              {state?.stats.repsTotal ?? 0}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">รอบถูก</IonCol>
            <IonCol size="6" className="ion-text-right">
              {state?.stats.repsOk ?? 0}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">รอบผิด</IonCol>
            <IonCol size="6" className="ion-text-right">
              {state?.stats.repsBad ?? 0}
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">Tempo เฉลี่ย</IonCol>
            <IonCol size="6" className="ion-text-right">
              {state?.stats.avgRepMs ?? 0} ms
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">เปอร์เซ็นต์ถูก</IonCol>
            <IonCol size="6" className="ion-text-right">
              {state?.stats.repsTotal
                ? Math.round(
                    (state.stats.repsOk / state.stats.repsTotal) * 100
                  )
                : 0} %
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>

    {/* ปุ่มควบคุม */}
    <IonButton
      expand="block"
      size="large"
      color="success"
      onClick={start}
      disabled={state?.status === "RUNNING"}
    >
      ▶ Start
    </IonButton>

    <IonButton
      expand="block"
      size="large"
      color="danger"
      onClick={stop}
    >
      ■ Stop
    </IonButton>

  </IonContent>

  <IonFooter className="ion-padding ion-text-center">
    <small>
      673380015-1 ณัฏฐณิชา โยธะคง
    </small>
  </IonFooter>
</IonPage>
  );
};