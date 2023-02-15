#!/bin/bash
tf_apply_1_filename="/Users/ofer/projects/personal/tfh/tests/input/tfplan-apply.txt"
tf_apply_2_filename="/Users/ofer/projects/personal/tfh/tests/input/tfapply-error.txt"


while read p; do  
  sleep 0.05
  echo -n "$p"
done <$tf_apply_1_filename

read -p "Do you want to perform these actions?" -n 1 -r
echo    # (optional) move to a new line

while read p; do  
  sleep 0.05
  echo -n "$p"
done <$tf_apply_2_filename
