import { defaults, isFunction } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import {
  Collection, Data,
  PropTypes as CustomPropTypes, VictoryClipContainer, VictoryContainer
} from "victory-core";
import ZoomHelpers, { RawZoomHelpers } from "./zoom-helpers";

const DEFAULT_DOWNSAMPLE = 150;

let pointerEventCache = {};
let pointerEventPrevDiff = -1;

const zoomScale = (currentDomain, evt, props, axis, zoomingIn, deltaPos) => {
  const [from, to] = currentDomain;
  const range = Math.abs(to - from);
  const minimumZoom = props.minimumZoom && props.minimumZoom[axis];

  const sign = !zoomingIn ? 1 : -1;
  // eslint-disable-next-line no-magic-numbers
  const delta = Math.min(Math.abs(deltaPos / 300), 0.5);
  const factor = Math.abs(1 + sign * delta);

  if (minimumZoom && range <= minimumZoom && factor < 1) {
    return currentDomain;
  }

  const [fromBound, toBound] = RawZoomHelpers.getDomain(props)[axis];
  const percent = RawZoomHelpers.getScalePercent(evt, props, axis);
  const point = factor * from + percent * (factor * range);
  const minDomain = RawZoomHelpers.getMinimumDomain(point, props, axis);
  const [newMin, newMax] = RawZoomHelpers.getScaledDomain(
    currentDomain,
    factor,
    percent
  );
  const newDomain = [
    newMin > fromBound && newMin < toBound ? newMin : fromBound,
    newMax < toBound && newMax > fromBound ? newMax : toBound
  ];
  const domain =
    Math.abs(minDomain[1] - minDomain[0]) >
      Math.abs(newDomain[1] - newDomain[0])
      ? minDomain
      : newDomain;
  return Collection.containsDates([fromBound, toBound])
    ? [new Date(domain[0]), new Date(domain[1])]
    : domain;
}

export const zoomContainerMixin = (base) =>
  class VictoryZoomContainer extends base {
    static displayName = "VictoryZoomContainer";

    static propTypes = {
      ...VictoryContainer.propTypes,
      allowPan: PropTypes.bool,
      allowZoom: PropTypes.bool,
      clipContainerComponent: PropTypes.element.isRequired,
      disable: PropTypes.bool,
      downsample: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      minimumZoom: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      }),
      onZoomDomainChange: PropTypes.func,
      zoomDimension: PropTypes.oneOf(["x", "y"]),
      zoomDomain: PropTypes.shape({
        x: CustomPropTypes.domain,
        y: CustomPropTypes.domain
      })
    };

    static defaultProps = {
      ...VictoryContainer.defaultProps,
      clipContainerComponent: <VictoryClipContainer />,
      allowPan: true,
      allowZoom: true,
      zoomActive: false
    };

    static defaultEvents = (props) => {

      const onPointerDown = (e, targetProps) => {
        pointerEventCache[e.pointerId] = e;
      };

      const handlePinchZoom = (evt, targetProps, ctx, zoomingIn, deltaPos) => {
        const { onZoomDomainChange, zoomDimension, zoomDomain } = targetProps;
        const originalDomain = RawZoomHelpers.getDomain(targetProps);
        const lastDomain = RawZoomHelpers.getLastDomain(targetProps, originalDomain);
        const { x, y } = lastDomain;

        console.log({ zoomDimension, zoomDomain, originalDomain, lastDomain, RawZoomHelpers });

        const currentDomain = {
          x:
            zoomDimension === "y"
              ? lastDomain.x
              : zoomScale(x, evt, targetProps, "x", zoomingIn, deltaPos),
          y:
            zoomDimension === "x"
              ? lastDomain.y
              : zoomScale(y, evt, targetProps, "y", zoomingIn, deltaPos)
        };
        const resumeAnimation = RawZoomHelpers.handleAnimation(ctx);

        const zoomActive =
          zoomingIn || // if zoomming in or
          //   if zoomActive is already set AND user hasn't zoommed out all the way
          (targetProps.zoomActive &&
            !RawZoomHelpers.checkDomainEquality(originalDomain, lastDomain));

        const mutatedProps = {
          currentDomain,
          originalDomain,
          cachedZoomDomain: zoomDomain,
          parentControlledProps: ["domain"],
          panning: false,
          zoomActive
        };

        if (isFunction(onZoomDomainChange)) {
          onZoomDomainChange(
            currentDomain,
            defaults({}, mutatedProps, targetProps)
          );
        }

        return [
          {
            target: "parent",
            callback: resumeAnimation,
            mutation: () => mutatedProps
          }
        ];
      }

      const onPointerMove = (e, targetProps, eventKey, ctx) => {
        pointerEventCache[e.pointerId] = e;

        if (!targetProps.allowZoom) {
          return undefined;
        }

        let res;

        // Two pointers are down, so check for pinch gestures.
        if (Object.keys(pointerEventCache).length === 2) {
          let [a, b] = Object.values(pointerEventCache)
          let curDiff = Math.abs(a.clientX - b.clientX); // distance between the pointers

          // The user is zooming on a mobile device!
          if (pointerEventPrevDiff > 0) {
            if (curDiff > pointerEventPrevDiff) {
              console.log("Pinch moving OUT -> Zoom in", e);

              res = handlePinchZoom(e, targetProps, ctx, true, curDiff);
            } else if (curDiff < pointerEventPrevDiff) {
              console.log("Pinch moving IN -> Zoom out", e);

              res = handlePinchZoom(e, targetProps, ctx, false, curDiff);
            }
          }

          // Cache the distance for the next move event
          pointerEventPrevDiff = curDiff;
        }

        return res;
      };

      const onPointerUp = (e, targetProps) => {
        delete pointerEventCache[e.pointerId];

        if (pointerEventCache.length < 2) {
          pointerEventPrevDiff = -1;
        }
      };

      return [
        {
          target: "parent",
          eventHandlers: {
            onMouseDown: (evt, targetProps) => {
              return props.disable
                ? {}
                : ZoomHelpers.onMouseDown(evt, targetProps);
            },
            onTouchStart: (evt, targetProps) => {
              return props.disable
                ? {}
                : ZoomHelpers.onMouseDown(evt, targetProps);
            },
            onMouseUp: (evt, targetProps) => {
              return props.disable
                ? {}
                : ZoomHelpers.onMouseUp(evt, targetProps);
            },
            onTouchEnd: (evt, targetProps) => {
              return props.disable
                ? {}
                : ZoomHelpers.onMouseUp(evt, targetProps);
            },
            onMouseLeave: (evt, targetProps) => {
              return props.disable
                ? {}
                : ZoomHelpers.onMouseLeave(evt, targetProps);
            },
            onTouchCancel: (evt, targetProps) => {
              return props.disable
                ? {}
                : ZoomHelpers.onMouseLeave(evt, targetProps);
            },
            // eslint-disable-next-line max-params
            onMouseMove: (evt, targetProps, eventKey, ctx) => {
              if (props.disable) {
                return {};
              }
              return ZoomHelpers.onMouseMove(evt, targetProps, eventKey, ctx);
            },
            // eslint-disable-next-line max-params
            onTouchMove: (evt, targetProps, eventKey, ctx) => {
              if (props.disable) {
                return {};
              }
              //evt.preventDefault();
              return ZoomHelpers.onMouseMove(evt, targetProps, eventKey, ctx);
            },
            onPointerDown,
            onPointerMove,
            onPointerUp,
            ...(props.disable || !props.allowZoom
              ? {}
              : { onWheel: ZoomHelpers.onWheel })
          }
        }
      ];
    };

    clipDataComponents(children, props) {
      const { scale, clipContainerComponent, polar, origin, horizontal } =
        props;
      const rangeX = horizontal ? scale.y.range() : scale.x.range();
      const rangeY = horizontal ? scale.x.range() : scale.y.range();
      const plottableWidth = Math.abs(rangeX[0] - rangeX[1]);
      const plottableHeight = Math.abs(rangeY[0] - rangeY[1]);
      const radius = Math.max(...rangeY);
      const groupComponent = React.cloneElement(clipContainerComponent, {
        clipWidth: plottableWidth,
        clipHeight: plottableHeight,
        translateX: Math.min(...rangeX),
        translateY: Math.min(...rangeY),
        polar,
        origin: polar ? origin : undefined,
        radius: polar ? radius : undefined,
        ...clipContainerComponent.props
      });
      return React.Children.toArray(children).map((child) => {
        if (!Data.isDataComponent(child)) {
          return child;
        } else {
          return React.cloneElement(child, { groupComponent });
        }
      });
    }

    modifyPolarDomain(domain, originalDomain) {
      // Only zoom the radius of polar charts. Zooming angles is very confusing
      return {
        x: originalDomain.x,
        y: [0, domain.y[1]]
      };
    }

    downsampleZoomData(props, child, domain) {
      const { downsample } = props;

      const getData = (childProps) => {
        const { data, x, y } = childProps;
        const defaultGetData =
          child.type && isFunction(child.type.getData)
            ? child.type.getData
            : () => undefined;
        // skip costly data formatting if x and y accessors are not present
        return Array.isArray(data) && !x && !y
          ? data
          : defaultGetData(childProps);
      };

      const data = getData(child.props);

      // return undefined if downsample is not run, then default() will replace with child.props.data
      if (!downsample || !domain || !data) {
        return undefined;
      }

      const maxPoints = downsample === true ? DEFAULT_DOWNSAMPLE : downsample;
      const dimension = props.zoomDimension || "x";

      // important: assumes data is ordered by dimension
      // get the start and end of the data that is in the current visible domain
      let startIndex = data.findIndex(
        (d) => d[dimension] >= domain[dimension][0]
      );
      let endIndex = data.findIndex((d) => d[dimension] > domain[dimension][1]);
      // pick one more point (if available) at each end so that VictoryLine, VictoryArea connect
      if (startIndex !== 0) {
        startIndex -= 1;
      }
      if (endIndex !== -1) {
        endIndex += 1;
      }

      const visibleData = data.slice(startIndex, endIndex);

      return Data.downsample(visibleData, maxPoints, startIndex);
    }

    modifyChildren(props) {
      const childComponents = React.Children.toArray(props.children);
      // eslint-disable-next-line max-statements
      return childComponents.map((child) => {
        const role = child.type && child.type.role;
        const isDataComponent = Data.isDataComponent(child);
        const { currentDomain, zoomActive, allowZoom } = props;
        const originalDomain = defaults({}, props.originalDomain, props.domain);
        const zoomDomain = defaults({}, props.zoomDomain, props.domain);
        const cachedZoomDomain = defaults(
          {},
          props.cachedZoomDomain,
          props.domain
        );
        let domain;
        if (!ZoomHelpers.checkDomainEquality(zoomDomain, cachedZoomDomain)) {
          // if zoomDomain has been changed, use it
          domain = zoomDomain;
        } else if (allowZoom && !zoomActive) {
          // if user has zoomed all the way out, use the child domain
          domain = child.props.domain;
        } else {
          // default: use currentDomain, set by the event handlers
          domain = defaults({}, currentDomain, originalDomain);
        }

        let newDomain = props.polar
          ? this.modifyPolarDomain(domain, originalDomain)
          : domain;
        if (newDomain && props.zoomDimension) {
          // if zooming is restricted to a dimension, don't squash changes to zoomDomain in other dim
          newDomain = {
            ...zoomDomain,
            [props.zoomDimension]: newDomain[props.zoomDimension]
          };
        }
        // don't downsample stacked data
        const newProps =
          isDataComponent && role !== "stack"
            ? {
              domain: newDomain,
              data: this.downsampleZoomData(props, child, newDomain)
            }
            : { domain: newDomain };
        return React.cloneElement(child, defaults(newProps, child.props));
      });
    }

    // Overrides method in VictoryContainer
    getChildren(props) {
      const children = this.modifyChildren(props);
      return this.clipDataComponents(children, props);
    }
  };

export default zoomContainerMixin(VictoryContainer);
