# Güroskoobi ja vibratsiooni demo

## Eesmärk

Rakenduse eraldi leht **Güroskoobi mäng** kasutab sisendina telefoni güroskoopi ja väljundina telefoni haptikat ehk vibratsiooni. Kasutaja pöörab telefoni nagu rooli, et liigutada sinine ring sihtmärki. Tabamus annab punkti, viib sihtmärgi teise otsa ja käivitab lühikese vibratsiooni.

## Teostus

- Paigaldasin Expo SDK 57-ga sobivad paketid käsuga `npx expo install expo-sensors expo-haptics`.
- `Gyroscope.isAvailableAsync()` kontrollib enne kuulamise alustamist, kas andur on olemas. Brauseris küsitakse andurile luba kasutaja nupuvajutuse järel.
- `Gyroscope.addListener()` edastab X-, Y- ja Z-telje pöörlemiskiiruse radiaanides sekundis. Näidud kuvatakse lehel.
- Arvutan kolme telje põhjal pöörlemise tugevuse valemiga `sqrt(x² + y² + z²)`. Mäng kasutab Z-telge: näidu märk määrab liikumise suuna ja suurus kiiruse. Väike surnud tsoon vähendab paigalseisva telefoni värinat; mõõtmiste ajatemplid teevad liikumise sõltumatumaks sündmuste sagedusest.
- Sihtmärgini jõudes käivitatakse `Haptics.notificationAsync(Success)`. Kasutaja saab vibratsiooni välja lülitada. Tabamuste vahele jääb vähemalt 700 ms, et üks liigutus ei annaks kiiresti mitu punkti.
- Anduri tellimus eemaldatakse, kui mäng peatatakse või lehelt lahkutakse.

## Mis oli lihtne ja mis keerulisem

Expo anduri ja haptika API-d on väikesed: anduri saadavuse kontroll, sündmuste kuulamine ja tagasiside käivitamine vajavad vähe koodi. Keerulisem oli teisendada pöörlemiskiirus mängus liikumiseks nii, et eri seadmete näidud ja sündmuste sagedus ei muudaks mängu liiga hüplikuks. Selleks kasutan ajatemplipõhist liikumist, surnud tsooni ja piiratud sammu. Samuti tuleb arvestada, et kõik seadmed ja brauserid ei paku güroskoopi ega vibratsiooni; leht annab anduri puudumisest teada.

## Kontrollimine

Käivita rakendus füüsilisel telefonil, ava menüüst **Güroskoobi mäng** ja vajuta **Alusta**. Pööra telefoni ekraani tasapinnas kord ühele, kord teisele poole. Kontrolli, et X/Y/Z näidud muutuvad, ring liigub, sihtmärgi tabamisel punktisumma kasvab ning telefon annab haptilise tagasiside. Seejärel lülita vibratsioon välja ja kontrolli, et punktid tulevad ilma tagasisideta. Testi ka peatamist ja lehelt lahkumist. Simulaatoris ei pruugi andurit olla.

## Allikad

- [Expo SDK 57 güroskoobi dokumentatsioon](https://docs.expo.dev/versions/v57.0.0/sdk/gyroscope/)
- [Expo SDK 57 haptika dokumentatsioon](https://docs.expo.dev/versions/v57.0.0/sdk/haptics/)
