#!/bin/bash
tf_plan_filename=`${__dirname}../input/tfplan-apply.txt`

while read p; do  
  sleep 0.01
  echo -n "$p"
done <$tf_plan_filename