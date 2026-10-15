from pathlib import Path
from PIL import Image
import numpy as np
import json, shutil

root=Path(__file__).resolve().parents[1]
project=root
source=project/'references/originals/codex-clipboard-bb5b3830-cad4-4702-8241-5bf2c64ba18d.png'
im=Image.open(source).convert('RGB')
a=np.asarray(im).astype(np.float32)
# Only used to find composition bounds. Pixel colors in the exports are never changed.
red=(a[:,:,0]>32)&(a[:,:,0]>a[:,:,1]*1.4)&(a[:,:,0]>a[:,:,2]*1.4)
columns=np.flatnonzero(red.sum(axis=0)>3)
runs=[r for r in np.split(columns,np.flatnonzero(np.diff(columns)>12)+1) if len(r)>100]
assert len(runs)==2
folder=project/'public/assets/editorial'
report=[]
for run,name in zip(runs,['desktop','mobile']):
    left,right=int(run[0]),int(run[-1])+1
    rows=np.flatnonzero(red[:,left:right].sum(axis=1)>3)
    top,bottom=int(rows[0]),int(rows[-1])+1
    # Three pixels inward remove edge antialiasing/rounded outer corners completely.
    box=(left+3,top+3,right-3,bottom-3)
    crop=im.crop(box)
    filename=f'badboys-hero-{name}.webp'
    target=folder/filename
    crop.save(target,format='WEBP',lossless=True,quality=100,method=6,exact=True)
    decoded=Image.open(target).convert('RGB')
    assert np.array_equal(np.asarray(crop),np.asarray(decoded)), 'Lossless comparison failed'
    report.append({'file':filename,'detected_bounds':(left,top,right,bottom),'crop_box_exclusive':box,'width':crop.width,'height':crop.height,'bytes':target.stat().st_size,'pixel_identical_to_source_crop':True})
documentation=project/'docs/hero-update'
documentation.mkdir(parents=True,exist_ok=True)
(documentation/'crop-results.json').write_text(json.dumps({'source':source.name,'source_size':im.size,'inner_inset':3,'exports':report},indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
