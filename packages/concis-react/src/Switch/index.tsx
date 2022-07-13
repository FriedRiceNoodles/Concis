import React, { useState, useContext, useEffect, memo, useMemo } from 'react';
import { SwitchProps } from './interface';
import Loading from '../Loading';
import { GlobalConfigProps } from '../GlobalConfig/interface';
import cs from '../common_utils/classNames';
import { globalCtx } from '../GlobalConfig';
import './index.module.less';

const Switch = <T,>(props: SwitchProps<T>) => {
  const {
    disabled,
    className,
    defaultChecked = false,
    small,
    checkedChildren,
    unCheckedChildren,
    loading,
    handleChange,
  } = props;

  const [switchWidth, setSwitchWidth] = useState<T>(0);
  const [switchChildWidth, setSwitchChildWidth] = useState<T>(0);
  const [switchStatus, setSwitchStatus] = useState(defaultChecked);

  const { globalColor, prefixCls } = useContext(globalCtx) as GlobalConfigProps;

  const classNames = cs(prefixCls, className, 'concis-switch');

  useEffect(() => {
    if (checkedChildren && unCheckedChildren && document.querySelector('.concis-switch-child')) {
      setSwitchChildWidth(document.querySelector('.concis-switch-child').clientWidth);
      setSwitchWidth(document.querySelector('.concis-switch-child').clientWidth + 30);
    } else {
      setSwitchWidth(small ? 28 : 40);
    }
  }, [
    document.querySelector('.concis-switch-child')?.clientWidth,
    checkedChildren,
    unCheckedChildren,
  ]);

  const toggleSwitch = () => {
    if (disabled || loading) return;
    setSwitchStatus(!switchStatus);
    handleChange && handleChange(!switchStatus);
  };
  const switchStyle = useMemo(() => {
    return {
      '--switch-width': `${switchWidth}px`,
      '--switch-height': `${small ? 16 : 24}`,
      '--dot-transformX': switchStatus ? `${switchWidth - 16 - (small ? -2 : 4)}px` : '4px',
      '--dot-transformY': small ? '2.5px' : '4px',
      '--dot-size': `${small ? '12px' : '16px'}`,
      '--child-transform': switchStatus
        ? typeof checkedChildren === 'string'
          ? `4px`
          : '8px'
        : `${switchWidth - switchChildWidth - (typeof checkedChildren === 'string' ? 6 : -2)}px`,
      '--switch-bg': switchStatus ? globalColor || '#1890FF' : 'rgba(201,205,212,1',
      '--disabled': disabled || loading ? 'not-allowed' : 'pointer',
      '--opacity': disabled || loading ? '0.6' : '1',
    };
  }, [switchStatus, disabled, switchWidth, small, globalColor]);

  return (
    <div className={classNames} style={switchStyle} onClick={toggleSwitch}>
      <div className="concis-switch-dot">{loading && <Loading width="1em" height="1em" />}</div>
      {checkedChildren && unCheckedChildren && (
        <div className="concis-switch-child">
          {switchStatus ? checkedChildren : unCheckedChildren}
        </div>
      )}
    </div>
  );
};

export default memo(Switch);
