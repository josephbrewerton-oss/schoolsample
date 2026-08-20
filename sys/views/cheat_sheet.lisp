(view :className "card padding--md margin-bottom--md"
  (header :level 3 "Dynamic Cheat Sheet")
  (text "This view is rendered entirely from an S-expression stored in the VFS.")
  (box :className "row"
    (badge :variant "success" "Offline Ready")
    (badge :variant "secondary" "AST Evaluated"))
  (button :action "system:ping" :payload "lab-1" "Trigger Action"))