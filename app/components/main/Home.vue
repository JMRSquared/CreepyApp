<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout
      v-if="sentences"
      class="p-t-10"
      rows="auto,*,auto,auto"
      columns="auto,*,auto"
    >
      <Label
        colSpan="3"
        row="0"
        verticalAlignment="center"
        textAlignment="center"
        class="font-weight-bold m-10"
        :fontSize="18"
        textWrap="true"
        text="Type the following sentence as fast as possible."
      ></Label>
      <Ripple
        @tap="prvWord"
        col="0"
        row="1"
        verticalAlignment="center"
        height="100%"
        borderRadius="50%"
      >
        <Label
          :text="'mdi-chevron-left' | fonticon"
          verticalAlignment="center"
          :fontSize="40"
          class="mdi m-10"
        />
      </Ripple>
      <Label
        col="1"
        row="1"
        :fontSize="26"
        :textWrap="true"
        verticalAlignment="center"
        textAlignment="center"
        class="text-dark-orange p-15"
        :text="sentences[currentIndex]"
      ></Label>
      <Ripple
        @tap="nextWord"
        col="2"
        row="1"
        verticalAlignment="center"
        height="100%"
      >
        <Label
          :text="'mdi-chevron-right' | fonticon"
          verticalAlignment="center"
          :fontSize="40"
          class="mdi m-10"
        />
      </Ripple>
      <Label
        row="2"
        colSpan="3"
        v-show="counter > 0"
        fontSize="20"
        :textWrap="true"
        verticalAlignment="center"
        textAlignment="center"
        class="p-15"
        :text="
          `${done ? 'Done in ' : ''}${(counter / 1000).toFixed(1)} seconds`
        "
      ></Label>
      <TextView
        v-if="startTyping"
        colSpan="2"
        @blur="loseFocus"
        @focus="focused"
        @textChange="onTyping"
        row="3"
        :fontSize="15"
        v-model="txtPhrase"
        returnKeyType="done"
        hint="Type here ...."
      />
      <Ripple
        v-if="startTyping"
        @tap="restart"
        col="2"
        row="3"
        verticalAlignment="center"
        borderRadius="50%"
      >
        <Label
          :text="'mdi-refresh' | fonticon"
          :fontSize="30"
          class="mdi m-10"
        />
      </Ripple>
      <Ripple
        v-if="!startTyping"
        @tap="startTyping = true"
        backgroundColor="#c43c00"
        colSpan="3"
        class="p-10"
        row="3"
        verticalAlignment="center"
      >
        <Label
          class="text-white"
          text="Start"
          textAlignment="center"
          verticalAlignment="center"
        />
      </Ripple>
    </GridLayout>
  </page>
</template>

<script lang="ts">
import { setInterval, clearInterval } from "tns-core-modules/timer";
import { Color } from "tns-core-modules/color/color";

export default {
  data() {
    return {
      txtPhrase: "",
      done: false,
      startTyping: false,
      currentIndex: 0,
      counter: 0,
      sentences: [
        "File change detected",
        "Copying template files",
        "running release build or change in environment detected",
        "Platform android successfully added",
        "webpack is watching the files"
      ],
      timer: null
    };
  },
  methods: {
    onTyping(newVal) {
      if (!this.startTyping && newVal.length > 0) {
        this.startTyping = true;
      }
      if (newVal == this.sentences[this.currentIndex]) {
        this.done = true;
        clearInterval(this.timer);
      } else if (this.done) {
        this.done = false;
      }
    },
    loseFocus() {
      this.txtPhrase = "";
      this.startTyping = false;
      clearInterval(this.timer);
    },
    focused() {
      this.timer = setInterval(() => {
        if (this.startTyping) {
          this.counter += 1;
        }
      }, 1);
    },
    restart() {
      this.counter = 0;
      this.loseFocus();
      this.focused();
    },
    nextWord() {
      if (this.currentIndex < this.sentences.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.restart();
    },
    prvWord() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.sentences.length - 1;
      }
      this.restart();
    }
  }
};
</script>

<style scoped>
</style>
