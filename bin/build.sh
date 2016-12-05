#! /bin/bash

function log_info(){
    echo "[$(date '+%F %T')] "$@
}
log_info "current system: $(uname | tr [A-Z] [a-z])"
case $(uname | tr [A-Z] [a-z]) in
    "darwin")
        function readlink(){
            greadlink "$@"
        }
        function sed(){
            gsed "$@"
        }
        ;;
    *)
        ;;
esac

SELF=$(readlink -f $0)
DIR=$(dirname "$SELF")

. "$DIR/combine_js.sh"

if [ -f "$DIR/combine_js.sh" ];then

script_to_js_src "$WORKSPACE/src/view/trac/ticket.html"

$gulp_cmd prod
if [ $? -gt 0 ];then
    exit 1
fi

# combine js
combile_dist_js "$WORKSPACE/dist/view/upload.html"
combile_dist_js "$WORKSPACE/dist/view/index.html"
combile_dist_js "$WORKSPACE/dist/view/trips.html"
combile_dist_js "$WORKSPACE/dist/view/trac/ticket.html"

else
$gulp_cmd prod
exit $?
fi

