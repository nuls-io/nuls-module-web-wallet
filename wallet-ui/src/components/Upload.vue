<template>
	<div tabindex="0" class="el-upload el-upload--text" v-if="supportFileReader">
		<div
			class="el-upload-dragger"
			@click="clickToUpload" :class="{
				'is-dragover': dragover
			}"
			@drop.prevent="onDrop"
			@dragover.prevent="onDragover"
			@dragleave.prevent="dragover = false"
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">
				{{ $t('importAddress.importAddress18') }}
				<em>
					{{ $t('importAddress.importAddress19') }}
				</em>
			</div>
		</div>
		<input ref="uploadInput" type="file" name="file" accept=".keystore" class="el-upload__input" @change="handleUpload">
	</div>
	<div v-else>{{$t('importAddress.importAddress42')}}</div>
</template>

<script>
	export default {
		data() {
			return {
				supportFileReader: typeof FileReader !== "undefined",
				dragover: false
			}
		},
		methods: {
			onDragover() {
				this.dragover = true;
			},
			onDrop(e) {
				this.dragover = false;
				const files = [].slice.call(e.dataTransfer.files);
				if (files.length !== 1) return;
				// 限定.keystore文件 & 只能传一个文件
				const { name } = files[0];
				if (name.indexOf(".keystore") > -1) {
					this.$emit('upload', files[0]);
				}
			},
			clickToUpload() {
        this.$refs.uploadInput.dispatchEvent(new MouseEvent('click')) 
      },
			handleUpload(e) {
				this.$emit('upload', e.target.files[0]);
			}
		}
	}
</script>
