import { html, css, LitElement } from 'lit-element';

export class GoogleSignIn extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--google-sign-in-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
    };
  }

  constructor() {
    super();
    this.title = 'Hey there';
    this.counter = 5;
    this.script = this.script.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  render() {
    return html`
      <div class="g-signin2" data-onsuccess=${this.onSignIn}></div>
      ${this.script()}
    `;
  }

  onLoad() {
    console.log(gapi);
    gapi.load("client:auth2", () => {
      gapi.auth2.init({
        client_id: "828207170600-ba2r0cpgqu4sknf8ci46itbl8ss6doeb.apps.googleusercontent.com"
      });
    });
  }

  script() {
    const script = document.createElement('script');
    script.onload = this.onLoad.bind(this);
    script.src = 'https://apis.google.com/js/platform.js';
    return script;
  }

  onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    const profile = googleUser.getBasicProfile();
    console.log(`ID: ${  profile.getId()}`); // Don't send this directly to your server!
    console.log(`Full Name: ${  profile.getName()}`);
    console.log(`Given Name: ${  profile.getGivenName()}`);
    console.log(`Family Name: ${  profile.getFamilyName()}`);
    console.log(`Image URL: ${  profile.getImageUrl()}`);
    console.log(`Email: ${  profile.getEmail()}`);

    // The ID token you need to pass to your backend:
    const {id_token} = googleUser.getAuthResponse();
    console.log(`ID Token: ${  id_token}`);
  }

}
