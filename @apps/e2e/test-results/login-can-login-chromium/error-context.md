# Page snapshot

```yaml
- generic [ref=e2]:
  - img "boilerplate" [ref=e3]
  - generic [ref=e4]:
    - heading "Login" [level=1] [ref=e5]
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e9]: Email *
        - textbox "Email *" [ref=e10]: deflorenne.amaury@triptyk.eu
      - generic [ref=e11]:
        - generic [ref=e13]: Password *
        - generic [ref=e14]:
          - textbox "Password *" [ref=e15]: "123456789"
          - button "hide" [ref=e16]:
            - img [ref=e17]
      - button "Sign in" [active] [ref=e19] [cursor=pointer]
    - link "Forgot password?" [ref=e20] [cursor=pointer]:
      - /url: /forgot-password
```