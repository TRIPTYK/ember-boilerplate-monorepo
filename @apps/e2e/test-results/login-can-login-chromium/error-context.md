# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Sign in" [level=1] [ref=e4]
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e8]: Email *
      - textbox "Email *" [ref=e9]: deflorenne.amaury@triptyk.eu
    - generic [ref=e10]:
      - generic [ref=e12]: Password *
      - generic [ref=e13]:
        - textbox "Password *" [ref=e14]: "123456789"
        - button "hide" [ref=e15]:
          - img [ref=e16]
    - button "Sign in" [active] [ref=e18] [cursor=pointer]
  - link "Forgot password?" [ref=e19] [cursor=pointer]:
    - /url: /forgot-password
```