#!/bin/bash

# Compile
javac Main.java 2> compile_error.txt
if [ $? -ne 0 ]; then
  echo "Compilation Error:"
  cat compile_error.txt
  exit 1
fi

# Run with timeout 5 seconds, capture stderr and stdout
timeout 5 java Main > program_output.txt 2> runtime_error.txt
RUN_STATUS=$?

if [ $RUN_STATUS -eq 124 ]; then
  echo "Error: Program timed out after 5 seconds."
  exit 1
elif [ $RUN_STATUS -ne 0 ]; then
  echo "Runtime Error:"
  cat runtime_error.txt
  exit 1
else
  cat program_output.txt
fi
