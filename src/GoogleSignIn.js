import { html, LitElement } from 'lit-element';

export class GoogleSignIn extends LitElement {

  static get properties() {
    return {
      clientId: { type: String, attribute: "client-id" },
    };
  }

  constructor() {
    super();
    this.clientId = "";
    this.onGoogleScriptLoad = this.onGoogleScriptLoad.bind(this);
    this.onAuthChange = this.onAuthChange.bind(this);
  }

  render() {
    return html`
      ${this.loadGoogleScript()}
      <button id="google-sign-out" @click=${GoogleSignIn.signOut} style="display:none">sign out</button>
      <button id="google-sign-in" @click=${GoogleSignIn.signIn}>sign in</button>
    `;
  }

  onGoogleScriptLoad() {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({
        client_id: this.clientId
      }).then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();
        this.onAuthChange(this.auth.isSignedIn.get());
        this.auth.isSignedIn.listen(this.onAuthChange);
    });;
    });
  }

  onAuthChange (isSignedIn) {
    const signInButton =  this.shadowRoot.getElementById("google-sign-in");
    const signOutButton = this.shadowRoot.getElementById("google-sign-out");
    if (isSignedIn) {
        signInButton.style.display = "none";
        signOutButton.style.display = "block";
        const profile = this.auth.currentUser.get().getBasicProfile();
        window.localStorage.setItem("name", profile.getName());
        window.localStorage.setItem("email", profile.getEmail());
        window.localStorage.setItem("avatar", profile.getImageUrl());
        window.localStorage.setItem("idToken",this.auth.currentUser.get().getAuthResponse().id_token);
        // window.localStorage.setItem("")
    } else{
      signInButton.style.display = "block";
      signOutButton.style.display = "none";
    }
};

  static signIn() {
    gapi.auth2.getAuthInstance().signIn();
  }

  static signOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  loadGoogleScript() {
    const script = document.createElement('script');
    script.onload = this.onGoogleScriptLoad;
    script.src = 'https://apis.google.com/js/platform.js';
    return script;
  }
}
