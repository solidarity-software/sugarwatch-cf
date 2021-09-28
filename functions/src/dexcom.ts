import * as admin from "firebase-admin";

interface AuthenticateOptions {
  accessToken: string
  expiresIn: number
  refreshToken: string
}

/**
 *
 * @param {number} expiresIn
 * @return {Date}
 */
function expiresInToRefreshTime(expiresIn: number): Date {
  const refreshTime = new Date();
  refreshTime.setTime(refreshTime.getTime() + (expiresIn - 600) * 1000);
  return refreshTime;
}

/**
 *
 * @param {number} length
 * @return {string} code
 */
function makeCode(length: number): string {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


/**
 *
 */
export class Dexcom {
  id: string
  /**
   *
   * @param {string} id
   */
  constructor(id: string) {
    this.id = id;
  }

  /**
   * @param {string} id df
   */
  static async register(id: string): Promise<string> {
    const egvs = new Dexcom(id);
    return await egvs.register();
  }

  /**
   *
   * @return {string} code
   */
  async register(): Promise<string> {
    const code = makeCode(6);
    await admin.firestore().collection("watches").add({
      id: this.id,
      code,
    });

    return code;
  }
  /**
   *
   * @param {string} code
   * @param {any} options
   * @return {void}
   */
  static async authenticate(
      code: string,
      options: AuthenticateOptions,
  ): Promise<void> {
    const watches = await admin.firestore()
        .collection("watches")
        .where("code", "==", code).get();

    if (watches.size !== 1) {
      throw new Error("Invalid Code");
    }

    for (const watch of watches.docs) {
      const egvs = new Dexcom(watch.get("id"));
      await egvs.authenticate(options);
    }
  }

  /**
   *
   * @param {AuthenticateOptions} options
   */
  async authenticate(options: AuthenticateOptions): Promise<void> {
    const watches = await admin.firestore()
        .collection("watches")
        .where("id", "==", this.id).get();

    if (watches.size !== 1) {
      throw new Error("Invalid ID");
    }

    for (const watch of watches.docs) {
      await watch.ref.update({
        access_token: options.accessToken,
        refresh_time: expiresInToRefreshTime(options.expiresIn),
        refresh_token: options.refreshToken,
      });
    }
  }
}
