import { ChangeEvent, Component, HTMLProps } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import pick from 'lodash.pick';
import compare from 'compareq';

import { Label, Icon, Scroll, file as fileTools, array } from 'uilib';

import S from './InputFile.styl';
import Item from './Item/Item';

import * as T from './InputFile.types';
export * as InputFileTypes from './InputFile.types';

const defaultFileState = {
  total: 1,
  loaded: 0,
  error: null,
  base64: '',
};

export class InputFile extends Component<T.Props> {
  store;
  filesToUpload = []; // [File,...]
  previewRequests = {}; // [index]: Promise
  _mounted = false;

  constructor(props) {
    super(props);

    this.store = createStore(this, {
      items: this.getStateFromProps(),
      labelClipPath: '',
    });
  }

  static defaultProps = { rootUrl: '', size: 'm', maxCount: 1 };

  componentDidMount() {
    this._mounted = true;
    this.props.uploadOnDemand?.(this.demandedUploader);
  }

  componentWillUnmount() {
    this._mounted = false;
    this.store.items.forEach(({ xhr }) => xhr?.abort());
  }

  componentDidUpdate(prevProps) {
    const { value, maxCount } = this.props;

    if (!compare(prevProps.value, value) || prevProps.maxCount !== maxCount) {
      this.store.items = this.getStateFromProps();
    }
  }

  getStateFromProps() {
    const { value, maxCount, upload } = this.props;
    const loaded = upload ? 1 : 0;

    return value.slice(0, maxCount).map((src, index) => ({
      ...defaultFileState,
      loaded,
      index,
      src,
    }));
  }

  getValFromState = () =>
    this.store.items.map(({ src, base64 }) => src || base64);

  filterAllowedFiles(files) {
    const { value, maxCount, limit } = this.props;
    const allowedFiles = [];
    let index = value.length;

    [...files].every(file => {
      if (index >= maxCount) return false;

      if (limit) {
        const sizeMb = file.size / 1024 / 1024;

        if (sizeMb > limit) {
          console.error(`Max file size - ${limit}Mb`, file);
          return false;
        }
      }

      allowedFiles.push(file);
      return true;
    }, []);

    return allowedFiles;
  }

  onChange = async e => {
    const { files } = e.target;
    const { value, onSelect, uploadOnDemand, upload } = this.props;
    const { items } = this.store;
    let index = value.length;
    const allowedFiles = this.filterAllowedFiles(files);

    allowedFiles.forEach(file => {
      items.push({ ...defaultFileState, index });
      this.filesToUpload[index] = file;
      this.previewRequests[index] = this.generatePreview(file, index);
      index++;
    });

    onSelect?.(allowedFiles);

    if (upload) this.processUploadOnChange(allowedFiles);
    if (uploadOnDemand) this.processUploadOnDemand();
  };

  onProgress = state => e => {
    Object.assign(state, pick(e, ['total', 'loaded']));
  };

  async generatePreview(file, index) {
    const state = this.store.items[index];

    Object.assign(state, defaultFileState);
    state.base64 = await fileTools.toBase64(file);

    delete this.previewRequests[index];
  }

  async processUploadOnDemand() {
    await Promise.all(Object.values(this.previewRequests));

    if (!this._mounted) return;

    const { onChange } = this.props;

    onChange(null, this.getValFromState());
  }

  async processUploadOnChange(files) {
    const { value, onChange } = this.props;
    const reqs = files.map((file, i) => this.upload(file, value.length + i));

    await Promise.all(reqs);

    onChange(null, this.getValFromState());
  }

  async upload(file, index) {
    const { upload } = this.props;
    const { items } = this.store;
    const state = items[index];
    const src = await upload(
      file,
      this.onProgress(state),
      xhr => (state.xhr = xhr)
    );

    delete this.filesToUpload[index];

    if (!this._mounted) return;

    Object.assign(state, {
      src,
      loaded: state.total,
      xhr: null,
    });
  }

  demandedUploader = async upload => {
    const { value } = this.props;
    const { items } = this.store;
    const requests = [];
    const newVal = [...value];

    value.forEach((val, i) => {
      const file = this.filesToUpload[i];

      if (file) {
        requests.push(
          upload(file, this.onProgress(items[i])).then(url => (newVal[i] = url))
        );
      }
    });

    await Promise.all(requests);

    this.filesToUpload = [];

    return newVal;
  };

  remove = async value => {
    const { remove, onChange } = this.props;

    if (remove) {
      const res = await remove(value);
      if (!res) return;
    }

    const { items } = this.store;

    array.spliceWhere(items, value, 'src');

    onChange(
      null,
      items.map(({ src }) => src)
    );
  };

  render() {
    const { className, size, label, accept, maxCount } = this.props;
    const { items, labelClipPath } = this.store;

    const classes = cn(S.root, className, S[`size-${size}`]);

    return (
      <div className={classes}>
        <div className={S.border} style={{ clipPath: labelClipPath }} />

        <Label
          isOnTop
          size={size}
          className={S.label}
          onClipPathChange={clipPath => (this.store.labelClipPath = clipPath)}
        >
          {label}
        </Label>

        <Scroll x size="s" innerClassName={S.items}>
          {items.map(({ base64, src, loaded, total }, i) => {
            const url = base64 || src;

            return (
              <Item
                key={String(url) + i}
                className={S.item}
                img={url}
                total={total}
                loaded={loaded}
                waitingForUpload={!!this.filesToUpload[i]}
                onRemove={() => this.remove(url)}
              />
            );
          })}

          {items.length < maxCount && (
            <label className={cn(S.item, S.addButton)} key="add-button">
              <Icon type="plus" />
              <input
                className={S.input}
                type="file"
                multiple
                accept={accept}
                onChange={this.onChange}
              />
            </label>
          )}
        </Scroll>
      </div>
    );
  }
}
