## environment
- python 3.9
- cuda >= 11.8
## set up
- git clone my branch
- anaconda build a new env
- install cuda (or cudnn) (if you have nvidia GPU)
- install pytorch https://pytorch.org/ (it's version depends on your cuda)
- if you don't have nvidia GPU, run "conda install pytorch torchvision torchaudio cpuonly -c pytorch", 
if you have performed the above two steps, ignore this
- conda install -c conda-forge ultralytics
- You can make a preliminary prediction with "test.py"