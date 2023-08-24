<!--
 * @Description: 指标管理->详细信息->指标血缘 血缘图组件
 * @Author: wch
 * @email: 1301457114@qq.com
 * @Date: 2023-08-08 14:44:09
 * @LastEditors: wch
 * @LastEditTime: 2023-08-17 17:14:18
-->

<template>
    <div id="container" ref="container" style="width: 100%; height: 100%; border: 1px solid #000;"></div>
</template>

<script>
//用的是AntV的G6图表库
//https://g6.antv.antgroup.com/api/Graph
import G6 from "@antv/g6";
import { isObject } from '@antv/util';

import { getIndicatorTree } from '@/api/dictionary.js';
import circle_plus from '@/icons/svg/circle-plus.svg';

export default {
    name: 'svgTable',
    props: {
        indicatorId: {
            type: String,
        }
    },
    data() {
        return {
            data: {
                nodes: [],
                edges: [],
            },
            graph: null,
            container: this.$refs.container,

            //本来想动态获取container的宽高,但是在mounted中用nextTick等DOM加载完后也没获取到,没搞懂
            containerWidth: 1210,
            containerHeight: 600,
        }
    },
    mounted() {
        this.getIndicatorTreeList();
        window.addEventListener("resize", this.handleResize);
    },
    methods: {
        /**
         * @description: 获取指标血缘图的结点信息与边信息,初始化图标
         * @return {*}
         * @author: wch
         */
        getIndicatorTreeList() {
            getIndicatorTree({ indicatorId: this.indicatorId }).then(res => {
                this.data.nodes = res.data.records.nodes;
                this.data.edges = res.data.records.edges;
                for (let i = 0; i < this.data.nodes.length; i++) {
                    this.data.nodes[i].id = this.data.nodes[i].indicatorId;
                }
                this.registerG6();
                this.graph = this.initGraph();
            }).catch(error => {
                console.log(error);
            });
        },
        /**
         * @description: 配置图表信息,配置默认结点信息与默认边信息,并添加事件信息
         * @return {*}
         * @author: wch
         */
        initGraph() {
            const graph = new G6.Graph({
                container: "container",
                width: this.containerWidth,
                height: this.containerHeight,
                layout: {
                    type: "dagre",
                    rankdir: "LR",
                    nodesep: 15,
                    ranksep: 80,
                },
                modes: {
                    default: ["drag-canvas"],
                },
                defaultNode: {
                    type: "basic-rect",
                    labelCfg: {
                        style: {
                            fill: "#000000A6",
                            fontSize: 14,
                        },
                    },
                    style: {
                        stroke: "#000000",
                        width: 180,
                    },
                },
                defaultEdge: {
                    type: "fund-polyline",
                },
            });

            graph.data(this.data);

            graph.node((node) => {
                if (node.indicatorType != 4) {
                    return {
                        shape: 'basic-rect', // 使用矩形节点模板
                    };
                } else if (node.indicatorType == 4) {
                    return {
                        shape: 'basic-rect', // 使用圆形节点模板
                    };
                }
            });

            graph.render();

            graph.on('show-more-circle:click', (ev) => {
                const shape = ev.target; // 被点击的图形
                console.log("click")
                console.log(shape)
            });

            graph.on('rect-shape', (ev) => {
                const shape = ev.target; // 被点击的图形
                console.log("click")
                console.log(shape)
            });


            graph.on('node:click', (ev) => {
                const node = ev.item; // 被点击的节点元素
                console.log(node)
                this.$router.replace({ path: '/indicator/dictionary/detail', query: { indicatorId: node._cfg.id } })
                setTimeout(function () { window.location.reload(); }, 15);
            });

            const edges = graph.getEdges();
            edges.forEach(function (edge) {
                const line = edge.getKeyShape();
                const stroke = line.attr("stroke");
                const targetNode = edge.getTarget();
                targetNode.update({
                    style: {
                        stroke,
                    },
                });
            });
            graph.paint();
            return graph;
        },

        /**
         * @description: 注册结点与边
         * @return {*}
         * @author: wch
         */
        registerG6() {
            //指标结点信息
            G6.registerNode(
                "basic-rect",
                {
                    drawShape: function drawShape(cfg, group) {
                        const { label, indicatorTypeName, indicatorName } = cfg;
                        const width = cfg.style.width;
                        const stroke = cfg.style.stroke;
                        const rect = group.addShape("rect", {
                            attrs: {
                                x: 0,
                                y: 0,
                                width,
                                height: 60,
                                radius: 0,
                                stroke: "#000000",
                                lineWidth: 1.2,
                                fillOpacity: 1,
                                onClick: (event) => {
                                    //event.stopPropagation();
                                    console.log("click")
                                },
                            },
                            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                            name: "rect-shape",
                        });
                        group.addShape("circle", {
                            attrs: {
                                x: 0,
                                y: 30,
                                r: 3,
                                fill: stroke,
                            },
                            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                            name: "circle-shape",
                        });
                        group.addShape("circle", {
                            attrs: {
                                x: width,
                                y: 30,
                                r: 3,
                                fill: stroke,
                            },
                            // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                            name: "circle-shape2",
                        });

                        group.addShape("text", {
                            attrs: {
                                x: 10,
                                y: 20,
                                text: indicatorTypeName,
                                fontSize: 10,
                                fill: "#000",
                                opacity: 0.85,
                            },
                        });
                        group.addShape("text", {
                            attrs: {
                                x: 10,
                                y: 50,
                                text: indicatorName,
                                fontSize: 14,
                                fill: "#000",
                                opacity: 0.95,
                            },
                        });
                        return rect;
                    },
                    getAnchorPoints: function getAnchorPoints() {
                        return [
                            [0, 0.5],
                            [1, 0.5],
                        ];
                    },
                    update: function update(cfg, item) {
                        const group = item.getContainer();
                        const children = group.get("children");
                        const node = children[0];
                        const circleLeft = children[1];
                        const circleRight = children[2];

                        const stroke = cfg.style.stroke;

                        if (stroke) {
                            node.attr("stroke", stroke);
                            circleLeft.attr("fill", stroke);
                            circleRight.attr("fill", stroke);
                        }
                    },
                },
                "single-node"
            );

            // 本来想给复合指标单独新开一个结点类型,添加新的事件,但是没搞懂
            // G6.registerNode(
            //     "composite-rect",
            //     {
            //         drawShape: function drawShape(cfg, group) {
            //             const { label, indicatorTypeName, indicatorName } = cfg;
            //             const width = cfg.style.width;
            //             const stroke = cfg.style.stroke;
            //             const rect = group.addShape("rect", {
            //                 attrs: {
            //                     x: 0,
            //                     y: 0,
            //                     width,
            //                     height: 60,
            //                     radius: 0,
            //                     stroke: "#000000",
            //                     lineWidth: 1.2,
            //                     fillOpacity: 1,
            //                 },
            //                 // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            //                 name: "rect-shape",
            //             });
            //             group.addShape("circle", {
            //                 attrs: {
            //                     x: 0,
            //                     y: 30,
            //                     r: 3,
            //                     fill: stroke,
            //                 },
            //                 // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            //                 name: "circle-shape",
            //             });

            //             group.addShape("circle", {
            //                 attrs: {
            //                     x: width,
            //                     y: 30,
            //                     r: 20,
            //                     stroke: "#000",
            //                 },
            //                 // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
            //                 name: "show-more-circle",
            //                 onClick: (event) => {
            //                     //event.stopPropagation();
            //                     console.log("click")
            //                 },
            //             });

            //             group.addShape("image", {
            //                 attrs: {
            //                     x: width,
            //                     y: 30,
            //                     width: 20,
            //                     height: 20,
            //                     img: circle_plus,
            //                 },
            //                 name: "svg-icon",
            //             });

            //             group.addShape("text", {
            //                 attrs: {
            //                     x: 10,
            //                     y: 20,
            //                     text: indicatorTypeName,
            //                     fontSize: 10,
            //                     fill: "#000",
            //                     opacity: 0.85,
            //                 },
            //             });
            //             group.addShape("text", {
            //                 attrs: {
            //                     x: 10,
            //                     y: 50,
            //                     text: indicatorName,
            //                     fontSize: 14,
            //                     fill: "#000",
            //                     opacity: 0.95,
            //                 },
            //             });
            //             return rect;
            //         },
            //         getAnchorPoints: function getAnchorPoints() {
            //             return [
            //                 [0, 0.5],
            //                 [1, 0.5],
            //             ];
            //         },
            //     },
            //     "single-node"
            // );

            // 边信息
            G6.registerEdge("fund-polyline", {
                itemType: "edge",
                draw: function draw(cfg, group) {
                    const startPoint = cfg.startPoint;
                    const endPoint = cfg.endPoint;

                    const Ydiff = endPoint.y - startPoint.y;

                    const slope = Ydiff !== 0 ? Math.min(500 / Math.abs(Ydiff), 20) : 0;

                    const cpOffset = slope > 15 ? 0 : 16;
                    const offset = Ydiff < 0 ? cpOffset : -cpOffset;

                    const line1EndPoint = {
                        x: startPoint.x + slope,
                        y: endPoint.y + offset,
                    };
                    const line2StartPoint = {
                        x: line1EndPoint.x + cpOffset,
                        y: endPoint.y,
                    };

                    // 控制点坐标
                    const controlPoint = {
                        x: ((line1EndPoint.x - startPoint.x) * (endPoint.y - startPoint.y)) / (line1EndPoint.y - startPoint.y) + startPoint.x,
                        y: endPoint.y,
                    };

                    let path = [
                        ["M", startPoint.x, startPoint.y],
                        ["L", line1EndPoint.x, line1EndPoint.y],
                        ["Q", controlPoint.x, controlPoint.y, line2StartPoint.x, line2StartPoint.y],
                        ["L", endPoint.x, endPoint.y],
                    ];

                    if (Math.abs(Ydiff) <= 5) {
                        path = [
                            ["M", startPoint.x, startPoint.y],
                            ["L", endPoint.x, endPoint.y],
                        ];
                    }

                    const endArrow = cfg?.style && cfg.style.endArrow ? cfg.style.endArrow : false;
                    if (isObject(endArrow)) endArrow.fill = stroke;
                    const line = group.addShape("path", {
                        attrs: {
                            path,
                            stroke: "#000000",
                            lineWidth: 1.2,
                            endArrow,
                        },
                        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                        name: "path-shape",
                    });
                    return line;
                },
            });
        },
        /**
         * @description: 重新调整画布大小
         * @return {*}
         * @author: wch
         */
        handleResize() {
            if (this.graph) {
                this.graph.changeSize(this.$refs.container.offsetWidth, this.$refs.container.offsetHeight);
            }
        },
    },
    beforeDestroy() {
        if (this.graph) {
            this.graph.destroy();
            this.graph = null;
        }
        window.removeEventListener("resize", this.handleResize);
    },
}

</script>

<style></style>