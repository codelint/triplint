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

function combine_js()
{
    local last_line_num=0
    local js_num=1
    local line_num=0
    local code_text=""
    local src_val=""
    local local_src_file=""
    local is_local_src=0
    local last_line_num=0
    local start_line=0

    local html_file=$(readlink -f "$1")
    local html_dir=$(dirname "$html_file")
    local target=${html_file##*/}
    local js_prefix="../js/$target"
    local js_dir="$html_dir/$js_prefix"

    if [ ! -d "$js_dir" ];then
        mkdir -v "$js_dir"
    fi

    if [ ! -f "$html_file" ];then
        log_info "[error] file[$html_file] not exist"
        return 2;
    fi

    while read line
    do
        line_num=${line%%:*}
        code_text=${line#*:}
        src_val=$(echo $code_text | sed 's@.* src="\([^"]*\)".*@\1@')
        local_src_file="${html_dir}/${src_val}"
        if [ -f $(echo "$local_src_file" | sed 's@\.js@.min.js@') ];then
            local_src_file=$(echo "$local_src_file" | sed 's@\.js@.min.js@')
        fi
        if [ ! -f "$local_src_file" ];then
            log_info "[error] file[$local_src_file] not exist"
            return 1;
        fi
        echo "$src_val" | grep '^\.' >/dev/null
        is_local_src=$?
        if [ $is_local_src -gt 0 ];then
            log_info "[error] process line[$line] include remote uri"
            return 1;
        fi

        if [ $last_line_num -eq 0 ];then
            last_line_num=$line_num
            start_line=$line_num
            true > "${js_dir}/tmp.js"
        fi

        if [ $((line_num - last_line_num)) -gt 1 ];then
            if [ $((last_line_num - $start_line)) -gt 0 ];then
                cat "${js_dir}/tmp.js" > "${js_dir}/${js_num}.js"
                replace_js_with_combine_js $html_file $start_line $last_line_num "${js_prefix}/${js_num}.js"
                return $?
            fi

            js_num=$((js_num + 1))
            true > "${js_dir}/tmp.js"
            start_line=$line_num
        fi

        # echo append file[$src_val] to "${js_dir}/${js_num}.js"
        cat "$local_src_file" >> "${js_dir}/tmp.js"
        last_line_num=$line_num
    done
    cat "${js_dir}/tmp.js" > "${js_dir}/${js_num}.js"
    replace_js_with_combine_js $html_file $start_line $line_num "${js_prefix}/${js_num}.js"
    return $?
}

function replace_js_with_combine_js()
{
    local target_file=$1
    local start_line=$2
    local end_line=$3
    local src_js=$4
    local ret=0

    if [ $((last_line_num - $start_line)) -eq 0 ];then
        return 1
    fi

    sed -i.orig "${start_line},${end_line}c <script type=\"text/javascript\" src=\"$src_js\"></script>" $target_file
    ret=$?

    if [ $ret -eq 0 ];then
        log_info "[ok] replace with js[$src_js] success"
    fi
    return $ret
}

function combine_once()
{
    cat "$1" | grep '<script type="text/javascript".*</script>' -n | grep 'src="\.' | combine_js "$1"
    return $?
}

function main()
{
    if [ -z "$1" ];then
        log_info 'lack parameter'
        return 1
    fi
    local html_file=$(readlink -f "$1")

    if [ ! -f "$html_file" ];then
        log_info '[error] file[$html_file] not exist'
        return 1
    fi

    local ret=0
    log_info "start to process file[$html_file]"

    sleep 3
    while [ $ret -eq 0 ]
    do
        combine_once "$html_file"
        ret=$?
        sleep 1
    done
}

main "$1"