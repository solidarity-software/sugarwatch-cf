# sugarwatch-cf

This project uses [Cloud Functions](https://cloud.google.com/functions) to manage authenticating a user and their Android watch to a [DexCom](https://www.dexcom.com/) glucose monitoring account. The user will authorize the SugarWatch app to collect DexCom data for the glucose monitoring device and manage delivering occasional updates. Updates are potentially every 5 minutes and delivered via their phone data connection to be displayed on their watch as a watch face widget/complication. If the phone & watch are not available, the SugarWatch app will manage retrying to send the data, but only while that data is still relevant.

**Contributors**: [Michael Osuna](https://github.com/mikeosunajr), [Chris Chapman](https://github.com/SeattleChris), Ramona Ridgewell,

## Architecture

Written in JavaScript - TypeScript, this is being hosted on the [Google Cloud Platform](https://cloud.google.com/). This project currently has a [api test ping](https://sugarwatch.solidarity.software/api/ping) route. The project is using [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/concept-options) for managing delivering messages. Data persistence is using NoSQL cloud database - [Firestore](https://firebase.google.com/docs/firestore). Data is collected from the [DexCom API](https://developer.dexcom.com/overview).

## Getting Started

* Clone the [repository](https://github.com/solidarity-software/sugarwatch-cf)
* install dependencies with yarn: `yarn install`

## License

MIT License
