/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export const selectedLabel: { node: Record<string, string>; edge: Record<string, string> } = {
  node: {},
  edge: {},
};

const getLabel = (ele: cytoscape.NodeSingular | cytoscape.EdgeSingular, captionProp: string): string => {
  if (captionProp === 'gid') {
    if (ele.isNode()) {
      selectedLabel.node[ele.data('label') as string] = 'gid';
    } else {
      selectedLabel.edge[ele.data('label') as string] = 'gid';
    }
    return `[ ${ele.data('id') as string} ]`;
  }
  if (captionProp === 'label') {
    if (ele.isNode()) {
      selectedLabel.node[ele.data('label') as string] = 'label';
    } else {
      selectedLabel.edge[ele.data('label') as string] = 'label';
    }
    return `[ :${ele.data('label') as string} ]`;
  }
  const props = ele.data('properties') as Record<string, unknown>;
  if (props[captionProp] === undefined) {
    return '';
  }
  if (ele.isNode()) {
    selectedLabel.node[ele.data('label') as string] = captionProp;
  } else {
    selectedLabel.edge[ele.data('label') as string] = captionProp;
  }
  return String(props[captionProp]);
};

export const stylesheet: cytoscape.StylesheetCSS[] = [
  {
    selector: 'node',
    css: {
      width: (ele: cytoscape.NodeSingular) => (ele ? (ele.data('size') as number) : 55),
      height: (ele: cytoscape.NodeSingular) => (ele ? (ele.data('size') as number) : 55),
      label: (ele: cytoscape.NodeSingular) => {
        const captionProp = ele.data('caption') as string;
        return getLabel(ele, captionProp);
      },
      'background-color': (ele: cytoscape.NodeSingular) => (ele ? (ele.data('backgroundColor') as string) : '#FFF'),
      'border-width': '3px',
      'border-color': (ele: cytoscape.NodeSingular) => (ele ? (ele.data('borderColor') as string) : '#FFF'),
      'border-opacity': 0.6,
      'text-valign': 'center',
      'text-halign': 'center',
      color: (ele: cytoscape.NodeSingular) => (ele ? (ele.data('fontColor') as string) : '#FFF'),
      'font-size': '10px',
      'text-wrap': 'ellipsis',
      'text-max-width': (ele: cytoscape.NodeSingular) => String(ele ? (ele.data('size') as number) : 55),
    },
  },
  {
    selector: 'node.highlight',
    css: { 'border-width': '6px', 'border-color': '#B2EBF4' },
  },
  {
    selector: 'node:selected',
    css: { 'border-width': '6px', 'border-color': '#B2EBF4' },
  },
  {
    selector: 'edge',
    css: {
      width: (ele: cytoscape.EdgeSingular) => (ele ? (ele.data('size') as number) : 1),
      label: (ele: cytoscape.EdgeSingular) => {
        const captionProp = ele.data('caption') as string;
        return getLabel(ele, captionProp);
      },
      'text-background-color': '#FFF',
      'text-background-opacity': 1,
      'text-background-padding': '3px',
      'line-color': (ele: cytoscape.EdgeSingular) => (ele ? (ele.data('backgroundColor') as string) : '#FFF'),
      'target-arrow-color': (ele: cytoscape.EdgeSingular) => (ele ? (ele.data('backgroundColor') as string) : '#FFF'),
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      color: (ele: cytoscape.EdgeSingular) => (ele ? (ele.data('fontColor') as string) : '#FFF'),
      'font-size': '10px',
      'text-rotation': 'autorotate',
    },
  },
  {
    selector: 'edge.highlight',
    css: {
      width: (ele: cytoscape.EdgeSingular) => (ele ? (ele.data('size') as number) : 1),
      'line-color': '#B2EBF4',
      'target-arrow-color': '#B2EBF4',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
  {
    selector: 'edge:selected',
    css: {
      width: (ele: cytoscape.EdgeSingular) => (ele ? (ele.data('size') as number) : 1),
      'line-color': '#B2EBF4',
      'target-arrow-color': '#B2EBF4',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
];
