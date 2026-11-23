# VHS demo tape — `vhs demo.tape`
# Regenerate assets/demo.gif from the repository root.

Output assets/demo.gif

Set Shell "bash"
Set FontSize 17
Set FontFamily "JetBrains Mono, monospace"
Set Width 1000
Set Height 330
Set Padding 24
Set MarginFill "#0d1117"
Set BorderRadius 10
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms

Hide
Type "export PS1='\W $ '; alias haiku='./rust/target/release/haiku-core'; clear"
Enter
Show

Type "haiku print"
Enter
Sleep 1.6s

Type "haiku print | haiku verify"
Enter
Sleep 3.5s
