#!/bin/bash
tf_init_filename="/Users/ofer/projects/personal/tfh/tests/input/tfinit.txt"

process_file=$tf_init_filename

while read p; do
  sleep 0.1
  echo -n "$p"
done <$process_file