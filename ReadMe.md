# Gung Kodtest Alfred Karlsson

## cdk-virtual-scroll-viewport  
Använder cdk-virtual-scroll-viewport och cdkVirtualFor för att ladda datan medans man scrollar.
Jag lyckades inte ställa in så att headern var sticky och inte försvann vid scroll vilket hade varit snyggare och mer användarvänligt. Detta verkar vara ett känt problem med cdk-virtual-scroll-viewport. Försökte en del fix för detta men lyckades inte.

https://github.com/angular/components/issues/14833?fbclid=IwAR28OabaLpLJ27EgereOKt1ncMFWcjTw6sSyNdp0W_OSM05iKPxmHDAt1Fk

Hade kanske varit bättre att använda sig av lazy-loading eller paging. Att då även använda sig av mat-table skulle kunna vara ett bättre alternativ. 

## Data
Vid stor mängd data så läggs en knapp till för att lägga på filter vid varje input förändring och man måste då klicka på "Apply". Detta för att vid mindre data fungerar det att alltid applicera filter utan att tabellen behöver ladda. Testat för ca 5000 produkter med filter vid varje input.


## Install
npm install --legacy-peer-deps
