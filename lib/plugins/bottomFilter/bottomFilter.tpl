<div id="lvBottom_filter_rst" lv-if="isFilterFlag">
    <dl>
        <dt class="dt1" fcode="county=200569" p-tag="0~1" root-tag="0">武进区<i onclick="removeFcode(this)"></i></dt>
    </dl>
</div>


<!-- 双基联动 -->
<div id="lvBottom_filter_part" lv-if="isDoubleFlag" >
    <p>
        <span id="lvBottom_cancel">取消</span>
        <button id="lvBottom_clear">清空筛选</button>
        <span id="lvBottom_confirm">确认</span>
    </p>
    <div>
        <div id="lvBottom_namelist" >
            <span class="lvBottom_selected lvBottom_chosen">包含地区</span>
            <span>景点</span>
            <span>出发月份</span>
            <span>主题</span>
            <span>价格范围</span>
        </div>
        <div id="lvBottom_optionlist">
            <ul class="lvBottom_option_show">
                <li >1</li>
                <li class="lvBottom_chosen">2</li>
                <li >3</li>
                <li >4</li>
                <li >5</li>
            </ul>
        </div>
    </div>
</div>

<!-- 单级列表 -->
<div id="lvBottom_listwrap" lv-if="isSingleFlag" >
    <div id="lvBottom_fillList_part">    
        <ul>    
            <li itermcode="" class="chosen">不限</li>
            <li itermcode="routeNum=2">2天</li>
            <li itermcode="routeNum=3">3天</li>
            <li itermcode="routeNum=4">4天</li>
        </ul>
    </div>
</div>


<div id="lvBottom_screening" lv-if="tabFlag">
    <div class="base-part">
        <div class="time-filter chosen" lv-for="@tab in tabList" lv-on="click:toggleMatta(@tab.word)">
            <span lv-style="'backgroundImage:url(' + @tab.image + ')'"></span>
            <span lv-text="@tab.word">排序</span>
        </div>
    </div>
</div>


<div id="lvBottom_matte" lv-show="matteFlag" ></div>