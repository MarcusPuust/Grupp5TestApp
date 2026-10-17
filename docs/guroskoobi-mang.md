# Güroskoobi mäng

Tegin rakendusse eraldi lehe, kus saab telefoni pööramisega sinist ringi liigutada. Kui ring jõuab sihtmärgini, saab mängija punkti ja telefon vibreerib. Sihtmärk liigub siis teise otsa.

## Kuidas see töötab?

Rakendus loeb telefoni güroskoobilt kolme telje näite: X, Y ja Z. Need on lehel näha kraadides sekundis. Mängu juhib Z-telg, sest see muutub, kui keerata telefoni nagu rooli. Näitan ka kõigi kolme telje põhjal arvutatud pöörlemise tugevust.

Väikesed anduri kõikumised ei liiguta ringi. Sihtmärgi tabamisel annab telefon tugeva haptilise märguande; selle saab lehel välja lülitada. Mängu peatamisel või lehelt lahkudes lõpetab rakendus anduri kuulamise.

## Mis oli lihtne ja mis raske?

Expo abil oli anduri näitude lugemine ja vibratsiooni käivitamine üsna lihtne. Rohkem proovimist nõudis see, et ring liiguks telefoni pööramisega samas suunas ega hüppaks väikeste mõõtmiskõikumiste tõttu. Selleks muutsin liikumissuunda ja jätsin väga väikesed näidud arvestamata.

## Kuidas proovida?

Ava mäng päris telefonis, vajuta **Alusta** ja keera telefoni ekraani tasapinnas vasakule või paremale. Vaata, kas näidud ja ring liiguvad ning kas sihtmärgini jõudes tuleb punkt ja vibratsioon. Brauseris või simulaatoris ei pruugi güroskoop ega vibratsioon töötada.

Kasutasin [Expo güroskoobi](https://docs.expo.dev/versions/v57.0.0/sdk/gyroscope/) ja [haptika](https://docs.expo.dev/versions/v57.0.0/sdk/haptics/) juhendeid.
