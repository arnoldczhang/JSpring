<div class="g-city-sct-container">
    <header class="home-header hideHead" >
         <a class="u-back-btn" data-v-on:touchstart="close"><span class="back"></span></a>
        <div class="title">选择城市</div>
   </header>
    <div class="g-city-sct-hd">
        <input id="j-city-srh" class="u-city-srh" type="search" placeholder="选择常住地省份，更方便送签" 
               data-v-bind:class="{true : 'u-city-srh-search', false : ''}[self.onSearch]" 
               data-v-on:input="diyFilter" data-v-on:focus="hideCurrHist"   
               data-v-on:blur="remainAnchor" 
               data-v-on:compositionstart="stopComposing" 
               data-v-on:compositionend="startComposing"/>
        <span class="searchCancel" data-v-bind:class="{true : 'searchCancel-show', false : ''}[self.onSearch]" data-v-on:touchstart="showCurrHist">取消</span>
    </div>
    <div class="g-city-sct-bd">
        <ul class="city-list">
            <!-- <li id="ABROAD" data-v-hide="self.onSearch">
                <div class="m-city-scr-abroad">
                    <div data-v-on:click="switchTab(<%=index %>, <%=item.length %>)">
                        <span data-v-bind:class="{true : 'tabSelected', false : ''}[<%=index %> == self.tabIndex]"><%=item %></span>
                    </div>
                    <i id="tab-scrollbar" class="tab-scrollbar-num1" data-v-bind:class="{true : 'tab-scrollbar-num1', false : 'tab-scrollbar-num2'}[!self.tabIndex]"></i>
                </div>
            </li>
            <li id="CURRENT_actTitle" data-v-hide="self.onSearch" data-v-show="self.needCurrent">
                <h4 class="u-city-sct-cur-hd">当前定位城市</h4>
                <div class="m-city-scr-cur city_pr40" data-v-on:click="diyCurrCallback" data-render-id="CURRENT_div">
                    <div data-v-for="v in self.nowCurrCity trackBy $index">
                        <a data-name="{{v.name}}" data-id="{{v.id}}" data-pinyin="{{v.pinyin}}" data-code="{{v.code}}" data-index="$index">{{v.name}}</a>
                    </div>
                </div>
            </li>
            <li id="HOT_actTitle" data-v-hide="self.onSearch" data-v-show="!!self.nowHotList.length">
                <h4 class="u-city-sct-hot-hd">热门城市</h4>
                <div class="m-city-scr-hot city_pr40" data-v-show="!self.needHotImg" data-v-on:click="diyHotCallback" data-render-id="HOT_div">
                    <div data-v-for="v in self.nowHotList trackBy $index">
                        <a data-name="{{v.name}}" data-id="{{v.id}}" data-pinyin="{{v.pinyin}}" data-code="{{v.code}}" data-index="$index">{{v.name}}</a>
                    </div>
                </div>
                <div class="m-city-scr-hot city_pr40" data-v-show="self.needHotImg" data-v-on:click="diyHotCallback" data-render-id="HOT_div">
                    <div class="hot-img" data-v-for="v in self.nowHotList trackBy $index" data-name="{{v.name}}" data-id="{{v.id}}" data-pinyin="{{v.pinyin}}" data-code="{{v.code}}" data-index="$index" >
                        <div style="background-image:url({{v.hot_image}});"  data-name="{{v.name}}" data-id="{{v.id}}" data-pinyin="{{v.pinyin}}" data-code="{{v.code}}" data-index="$index"></div>
                    </div>
                </div>
            </li>
            <li id="HISTORY_actTitle" data-v-hide="self.onSearch" data-v-show="!!self.nowHisList.length">
                <h4 class="u-city-sct-hty-hd">历史选择城市</h4>
                <div class="m-city-scr-hty city_pr40" data-v-on:click="diyHisCallback" data-render-id="HISTORY_div">
                    <div data-v-for="v in self.nowHisList trackBy $index">
                        <a data-name="{{v.name}}" data-id="{{v.id}}" data-pinyin="{{v.pinyin}}" data-code="{{v.code}}" data-index="$index">{{v.name}}</a>
                    </div>
                </div>
            </li> -->
            <li lvmm-for="@letter in letterList" lvmm-attr="{'id' : @letter + '_actTitle'}" lvmm-data="{'key' : @letter}">
                <h4 class="sc-letter-list" data-v-on:click="toggleActList('<%=key %>_actTitle')" 
                    data-v-bind:class="{false : 'sc-letter-list-close', true : 'sc-letter-list-open'}[self.actList['<%=key %>_actTitle']]" lvmm-text="@letter | uppercase"></h4>
                <ul lvmm-on="click:getCityInfo($event)" lvmm-attr="{id : @letter + '_actTitle_UL'}" class="m-city-list" data-v-show="self.actList['<%=key %>_actTitle']" data-v-on:click="diyCallback">
                    <li lvmm-for="@city in letterCityList[@letter]" 
                        lvmm-text="@city.name" 
                        lvmm-data="{'name' : @city.name, 'id' : @city.id, 'code' : @city.code, 'pinyin' : @city.pinyin, 'index' : $index, 'renderId' : @letter + '_actTitle_LI_' + @city.id}"></li>
                </ul>
            </li>
        </ul>
        <div class="no-result" data-v-show="!self.nowAnchorList.length" data-v-html="self.noResultTip"></div>
    </div>
    <ul class="g-letter-list" data-v-hide="self.onSearch">
        <li lvmm-on="{'click' : anchorJump, 'touchmove' : anchorScroll}" 
             data-v-on:touchend="hideLetterTip" >
            <a lvmm-for="@letter in letterList" 
                lvmm-text="@letter | uppercase" 
                lvmm-data="{'hash' : '#' + @letter + '_actTitle'}" 
                href='javascript:void(0);'></a>
        </li>
    </ul>
    <div id="letterTip" data-v-html="self.letterTip" data-v-bind:class="{true : 'letterTipShow', false : 'letterTipHide'}[!!self.letterTip]"></div>
</div>
