 #!/bin/bash
 fontforge -lang=ff -c "Open('${1}.svg'); Generate('${1}_kerned.otf')"