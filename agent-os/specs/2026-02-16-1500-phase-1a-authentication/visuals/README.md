# Visuals for Phase 1A Authentication System

## Screenshots Provided

Two screenshots from the existing React application were provided as visual references for the Ember.js rebuild:

### 1. Login Page (`login.png` - to be added)

**UI Elements:**
- **Logo**: Registr logo at top
- **Title**: "Connexion"
- **Form Fields**:
  - Adresse email (email input)
  - Mot de passe (password input)
- **Link**: "Mot de passe oublié ?" (Forgot password link)
- **Primary Action**: Blue button labeled "CONNEXION"
- **Language Switcher**: EN/FR buttons in bottom right corner

**Design Details:**
- Dark navy blue background (#0A1929 or similar)
- Form centered on left side of screen
- Hero image on right side showing professional business woman
- Clean, minimal design
- Input fields with white text on dark background
- Primary button: Light blue (#37BCF8)

### 2. Forgot Password Page (`forgot-password.png` - to be added)

**UI Elements:**
- **Logo**: Registr logo at top
- **Title**: "Réinitialiser le mot de passe"
- **Description**: "Entrez votre adresse e-mail ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe."
- **Form Field**:
  - Adresse email (email input)
- **Actions**:
  - "ANNULER" button (secondary/outline style)
  - "ENVOYER LE LIEN" button (primary blue)
- **Language Switcher**: EN/FR buttons in bottom right corner

**Design Details:**
- Same dark navy blue background as login page
- Same layout: form on left, hero image on right
- Two-button layout: cancel (left) and submit (right)
- Explanatory text above the email field
- Consistent with login page styling

## Design System Notes

Based on the screenshots, the design system follows these patterns:

### Colors
- **Background**: Dark navy blue (~#0A1929)
- **Primary Action**: Light blue (#37BCF8 from tech stack)
- **Text**: White or light gray on dark background
- **Input Fields**: White borders with transparent background

### Typography
- Clean, modern sans-serif font
- Clear hierarchy: title > description > labels
- French language used in screenshots (FR/EN support required)

### Layout
- **Split Screen**: Form on left (40-50%), hero image on right (50-60%)
- **Form Container**: Centered vertically in left section
- **Spacing**: Generous white space, not cramped
- **Logo**: Top of form section

### Components
- **Input Fields**: Full-width within form container
- **Primary Buttons**: Full-width, blue background, white text
- **Secondary Buttons**: Outlined style (in forgot password)
- **Links**: Blue color, hover underline
- **Language Switcher**: Fixed position, bottom right, small buttons

## Implementation Notes

The new Ember.js implementation should:
1. Match the visual style and layout of these screenshots
2. Reuse existing components where possible (TpkLoginForm, TpkInputPrefab, etc.)
3. Ensure responsive design works on mobile (screenshots show desktop view)
4. Maintain consistency with the existing login page already implemented
5. Support both FR and EN languages with the same visual quality

## Additional Forms Needed

Based on the roadmap, we also need to create (not shown in screenshots):

### Registration Form
Should follow the same design pattern:
- Title: "Créer un compte" / "Create Account"
- Fields: Email, Password, First Name, Last Name
- Primary button: "S'INSCRIRE" / "Register"
- Link to login: "Vous avez déjà un compte ? Se connecter" / "Already have an account? Login"

### Reset Password Form
Should follow the same design pattern:
- Title: "Réinitialiser le mot de passe" / "Reset Password"
- Fields: New Password, Confirm Password
- Primary button: "RÉINITIALISER" / "Reset Password"
- Note: Token extracted from URL query parameter

---

*Note: Actual screenshot files should be placed in this directory during implementation. These screenshots serve as the visual reference for all authentication UI implementation.*
