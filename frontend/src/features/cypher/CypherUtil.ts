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

interface LabelColor {
  color: string;
  borderColor: string;
  fontColor: string;
  index: number;
}

interface NodeLabelColor extends LabelColor {
  nodeLabels: Set<string>;
}

interface EdgeLabelColor extends LabelColor {
  edgeLabels: Set<string>;
}

interface LabelSize {
  size: number;
  labels: Set<string>;
  index: number;
}

interface SelectedColor {
  color: string;
  borderColor: string;
  fontColor: string;
}

interface LegendEntry extends SelectedColor {
  size: number;
  caption: string;
}

interface GraphValue {
  id: string | number;
  label: string;
  start?: string | number;
  end?: string | number;
  start_id?: string | number;
  end_id?: string | number;
  properties: Record<string, unknown>;
}

interface MetadataValue {
  la_name: string;
  la_oid: string | number;
  la_start?: string | number;
  la_end?: string | number;
  la_count?: number;
}

interface CytoscapeNodeData {
  id: string | number;
  label: string;
  backgroundColor: string;
  borderColor: string;
  fontColor: string;
  size: number;
  properties: Record<string, unknown>;
  caption: string;
}

interface CytoscapeEdgeData extends CytoscapeNodeData {
  source: string | number;
  target: string | number;
}

interface CytoscapeElement {
  group: 'nodes' | 'edges';
  data: CytoscapeNodeData | CytoscapeEdgeData;
  alias?: string | number;
  classes: string;
}

interface GenerateResult {
  legend: {
    nodeLegend: Record<string, LegendEntry>;
    edgeLegend: Record<string, LegendEntry>;
  };
  elements: {
    nodes: CytoscapeElement[];
    edges: CytoscapeElement[];
  };
}

export const nodeLabelColors: NodeLabelColor[] = [
  {
    color: '#604A0E', borderColor: '#423204', fontColor: '#FFF', nodeLabels: new Set([]), index: 0,
  },
  {
    color: '#C990C0', borderColor: '#B261A5', fontColor: '#FFF', nodeLabels: new Set([]), index: 1,
  },
  {
    color: '#F79767', borderColor: '#F36924', fontColor: '#FFF', nodeLabels: new Set([]), index: 2,
  },
  {
    color: '#57C7E3', borderColor: '#23B3D7', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 3,
  },
  {
    color: '#F16667', borderColor: '#EB2728', fontColor: '#FFF', nodeLabels: new Set([]), index: 4,
  },
  {
    color: '#D9C8AE', borderColor: '#C0A378', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 5,
  },
  {
    color: '#8DCC93', borderColor: '#5DB665', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 6,
  },
  {
    color: '#ECB5C9', borderColor: '#DA7298', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 7,
  },
  {
    color: '#498EDA', borderColor: '#2870C2', fontColor: '#FFF', nodeLabels: new Set([]), index: 8,
  },
  {
    color: '#FFC454', borderColor: '#D7A013', fontColor: '#2A2C34', nodeLabels: new Set([]), index: 9,
  },
  {
    color: '#DA7194', borderColor: '#CC3C6C', fontColor: '#FFF', nodeLabels: new Set([]), index: 10,
  },
  {
    color: '#569480', borderColor: '#447666', fontColor: '#FFF', nodeLabels: new Set([]), index: 11,
  },
];

export const edgeLabelColors: EdgeLabelColor[] = [
  {
    color: '#CCA63D', borderColor: '#997000', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 0,
  },
  {
    color: '#C990C0', borderColor: '#B261A5', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 1,
  },
  {
    color: '#F79767', borderColor: '#F36924', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 2,
  },
  {
    color: '#57C7E3', borderColor: '#23B3D7', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 3,
  },
  {
    color: '#F16667', borderColor: '#EB2728', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 4,
  },
  {
    color: '#D9C8AE', borderColor: '#C0A378', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 5,
  },
  {
    color: '#8DCC93', borderColor: '#5DB665', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 6,
  },
  {
    color: '#ECB5C9', borderColor: '#DA7298', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 7,
  },
  {
    color: '#498EDA', borderColor: '#2870C2', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 8,
  },
  {
    color: '#FFC454', borderColor: '#D7A013', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 9,
  },
  {
    color: '#DA7194', borderColor: '#CC3C6C', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 10,
  },
  {
    color: '#569480', borderColor: '#447666', fontColor: '#2A2C34', edgeLabels: new Set([]), index: 11,
  },
];

export const nodeLabelSizes: LabelSize[] = [
  { size: 11, labels: new Set([]), index: 0 },
  { size: 33, labels: new Set([]), index: 0 },
  { size: 55, labels: new Set([]), index: 0 },
  { size: 77, labels: new Set([]), index: 0 },
  { size: 99, labels: new Set([]), index: 0 },
];

export const edgeLabelSizes: LabelSize[] = [
  { size: 1, labels: new Set([]), index: 0 },
  { size: 6, labels: new Set([]), index: 0 },
  { size: 11, labels: new Set([]), index: 0 },
  { size: 16, labels: new Set([]), index: 0 },
  { size: 21, labels: new Set([]), index: 0 },
];

export const nodeLabelCaptions: Record<string, string> = {};
export const edgeLabelCaptions: Record<string, string> = {};

const getCaption = (valType: string, val: GraphValue): string => {
  if (valType === 'node' && Object.prototype.hasOwnProperty.call(nodeLabelCaptions, val.label)) {
    return nodeLabelCaptions[val.label];
  }
  if (valType === 'edge' && Object.prototype.hasOwnProperty.call(edgeLabelCaptions, val.label)) {
    return edgeLabelCaptions[val.label];
  }

  let caption = valType === 'node' ? 'gid' : 'label';
  const { properties } = val;
  if (properties !== undefined) {
    if (Object.prototype.hasOwnProperty.call(properties, 'name')) {
      caption = 'name';
    } else if (Object.prototype.hasOwnProperty.call(properties, 'id')) {
      caption = 'id';
    }
  }

  return caption;
};

const getNodeColor = (labelName: string): SelectedColor => {
  let selectedColor: Partial<SelectedColor> = {};
  nodeLabelColors.forEach((labelColor) => {
    if (labelColor.nodeLabels.has(labelName)) {
      selectedColor = {
        color: labelColor.color,
        borderColor: labelColor.borderColor,
        fontColor: labelColor.fontColor,
      };
    }
  });

  if (Object.keys(selectedColor).length === 0) {
    const randomIndex = Math.floor(Math.random() * (nodeLabelColors.length));
    nodeLabelColors[randomIndex].nodeLabels.add(labelName);
    selectedColor = {
      color: nodeLabelColors[randomIndex].color,
      borderColor: nodeLabelColors[randomIndex].borderColor,
      fontColor: nodeLabelColors[randomIndex].fontColor,
    };
  }
  return selectedColor as SelectedColor;
};

const getEdgeColor = (labelName: string): SelectedColor => {
  let selectedColor: Partial<SelectedColor> = {};
  edgeLabelColors.forEach((labelColor) => {
    if (labelColor.edgeLabels.has(labelName)) {
      selectedColor = {
        color: labelColor.color,
        borderColor: labelColor.borderColor,
        fontColor: labelColor.fontColor,
      };
    }
  });

  if (Object.keys(selectedColor).length === 0) {
    const randomIndex = Math.floor(Math.random() * (edgeLabelColors.length));
    edgeLabelColors[randomIndex].edgeLabels.add(labelName);
    selectedColor = {
      color: edgeLabelColors[randomIndex].color,
      borderColor: edgeLabelColors[randomIndex].borderColor,
      fontColor: edgeLabelColors[randomIndex].fontColor,
    };
  }
  return selectedColor as SelectedColor;
};

const getNodeSize = (labelName: string): number => {
  let selectedSize = 0;

  const nSize = nodeLabelSizes.find((labelSize) => labelSize.labels.has(labelName));

  if (nSize) {
    selectedSize = nSize.size;
  } else {
    nodeLabelSizes[2].labels.add(labelName);
    selectedSize = nodeLabelSizes[2].size;
  }

  return selectedSize;
};

const getEdgeSize = (labelName: string): number => {
  let selectedSize = 0;

  const eSize = edgeLabelSizes.find((labelSize) => labelSize.labels.has(labelName));

  if (eSize) {
    selectedSize = eSize.size;
  } else {
    edgeLabelSizes[0].labels.add(labelName);
    selectedSize = edgeLabelSizes[0].size;
  }

  return selectedSize;
};

const sortByKey = (data: Record<string, unknown> | undefined): Record<string, unknown> => {
  const sorted: Record<string, unknown> = {};
  if (data === undefined) {
    return sorted;
  }
  Object.keys(data).sort().forEach((key) => {
    sorted[key] = data[key];
  });
  return sorted;
};

export const updateLabelColor = (labelType: string, labelName: string, newLabelColor: SelectedColor): void => {
  if (labelType === 'node') {
    nodeLabelColors.forEach((labelColor) => {
      if (labelColor.nodeLabels.has(labelName)) {
        labelColor.nodeLabels.delete(labelName);
      }

      if (labelColor.color === newLabelColor.color) {
        labelColor.nodeLabels.add(labelName);
      }
    });
  } else {
    edgeLabelColors.forEach((labelColor) => {
      if (labelColor.edgeLabels.has(labelName)) {
        labelColor.edgeLabels.delete(labelName);
      }

      if (labelColor.color === newLabelColor.color) {
        labelColor.edgeLabels.add(labelName);
      }
    });
  }
};

export const updateNodeLabelSize = (labelName: string, newLabelSize: number): void => {
  nodeLabelSizes.forEach((labelSize) => {
    if (labelSize.labels.has(labelName)) {
      labelSize.labels.delete(labelName);
    }

    if (labelSize.size === newLabelSize) {
      labelSize.labels.add(labelName);
    }
  });
};

export const updateEdgeLabelSize = (labelName: string, newLabelSize: number): void => {
  edgeLabelSizes.forEach((labelSize) => {
    if (labelSize.labels.has(labelName)) {
      labelSize.labels.delete(labelName);
    }

    if (labelSize.size === newLabelSize) {
      labelSize.labels.add(labelName);
    }
  });
};

export const updateLabelCaption = (labelType: string, labelName: string, newLabelCaption: string): void => {
  if (labelType === 'node') {
    nodeLabelCaptions[labelName] = newLabelCaption;
  } else {
    edgeLabelCaptions[labelName] = newLabelCaption;
  }
};

export const generateCytoscapeElement = (
  data: Record<string, unknown>[] | null | undefined,
  maxDataOfGraph: number,
  isNew: boolean,
): GenerateResult => {
  const nodes: CytoscapeElement[] = [];
  const edges: CytoscapeElement[] = [];
  const nodeLegend: Record<string, LegendEntry> = {};
  const edgeLegend: Record<string, LegendEntry> = {};

  function generateElements(alias: string | number, val: GraphValue): void {
    const labelName = val.label.trim();
    let source = val.start;
    let target = val.end;

    if (!source) {
      source = val.start_id;
    }

    if (!target) {
      target = val.end_id;
    }

    if (source && target) {
      if (!Object.prototype.hasOwnProperty.call(edgeLegend, labelName)) {
        edgeLegend[labelName] = {
          size: getEdgeSize(labelName),
          caption: getCaption('edge', val),
          ...getEdgeColor(labelName),
        };
      }
      if (!Object.prototype.hasOwnProperty.call(edgeLabelCaptions, labelName)) {
        edgeLabelCaptions[labelName] = 'label';

        // if has property named [ name ], than set [ name ]
        if (Object.prototype.hasOwnProperty.call(val.properties, 'name')) {
          nodeLabelCaptions[labelName] = 'name';
        }
      }

      if (!Object.prototype.hasOwnProperty.call(val.properties, edgeLegend.caption)) {
        edgeLegend[labelName].caption = getCaption('edge', val);
      }
      edges.push(
        {
          group: 'edges',
          data: {
            id: val.id,
            source,
            target,
            label: val.label,
            backgroundColor: edgeLegend[labelName].color,
            borderColor: edgeLegend[labelName].borderColor,
            fontColor: edgeLegend[labelName].fontColor,
            size: edgeLegend[labelName].size,
            properties: val.properties,
            caption: edgeLegend[labelName].caption,
          },
          alias,
          classes: isNew ? 'new node' : 'edge',
        },
      );
      console.log(JSON.stringify(labelName), edgeLegend[labelName], edges);
    } else {
      if (!Object.prototype.hasOwnProperty.call(nodeLegend, labelName)) {
        nodeLegend[labelName] = {
          size: getNodeSize(labelName),
          caption: getCaption('node', val),
          ...getNodeColor(labelName),
        };
      }
      if (!Object.prototype.hasOwnProperty.call(nodeLabelCaptions, labelName)) {
        nodeLabelCaptions[labelName] = 'gid';

        // if has property named [ name ], than set [ name ]
        if (Object.prototype.hasOwnProperty.call(val.properties, 'name')) {
          nodeLabelCaptions[labelName] = 'name';
        }
      }

      if (!Object.prototype.hasOwnProperty.call(val.properties, nodeLegend.caption)) {
        nodeLegend[labelName].caption = getCaption('node', val);
      }
      nodes.push(
        {
          group: 'nodes',
          data: {
            id: val.id,
            label: val.label,
            backgroundColor: nodeLegend[labelName].color,
            borderColor: nodeLegend[labelName].borderColor,
            fontColor: nodeLegend[labelName].fontColor,
            size: nodeLegend[labelName].size,
            properties: val.properties,
            caption: nodeLegend[labelName].caption,
          },
          alias,
          classes: isNew ? 'new node' : 'node',
        },
      );
    }
  }
  if (data) {
    data.forEach((row, index) => {
      if (index >= maxDataOfGraph && maxDataOfGraph !== 0) {
        return;
      }
      Object.entries(row).forEach((rowEntry) => {
        const [alias, val] = rowEntry;
        if (Array.isArray(val)) {
          // val이 Path인 경우 ex) MATCH P = (V)-[R]->(V2) RETURN P;
          Object.entries(val as unknown as Record<string, GraphValue>).forEach((valueEntry) => {
            const [pathAlias, pathVal] = valueEntry;
            generateElements(pathAlias, pathVal);
          });
        } else if (val) {
          generateElements(alias, val as GraphValue);
        }
      });
    });
  }
  console.log('edge sizes', edgeLabelSizes);
  return {
    legend: {
      nodeLegend: sortByKey(nodeLegend) as Record<string, LegendEntry>,
      edgeLegend: sortByKey(edgeLegend) as Record<string, LegendEntry>,
    },
    elements: {
      nodes,
      edges,
    },
  };
};

const generateMetadataElements = (
  nodeLegend: Record<string, LegendEntry>,
  edgeLegend: Record<string, LegendEntry>,
  nodes: CytoscapeElement[],
  edges: CytoscapeElement[],
  val: MetadataValue,
): void => {
  const labelName = val.la_name;
  if (val.la_start && val.la_end) {
    edges.push(
      {
        group: 'edges',
        data: {
          id: val.la_oid,
          source: val.la_start,
          target: val.la_end,
          label: val.la_name,
          backgroundColor: edgeLegend[labelName].color,
          borderColor: edgeLegend[labelName].borderColor,
          fontColor: edgeLegend[labelName].fontColor,
          size: edgeLegend[labelName].size,
          properties: { count: val.la_count, id: val.la_oid, name: val.la_name },
          caption: edgeLegend[labelName].caption,
        },
        classes: 'edge',
      },
    );
  } else {
    nodes.push(
      {
        group: 'nodes',
        data: {
          id: val.la_oid,
          label: val.la_name,
          backgroundColor: nodeLegend[labelName].color,
          borderColor: nodeLegend[labelName].borderColor,
          fontColor: nodeLegend[labelName].fontColor,
          size: nodeLegend[labelName].size,
          properties: { count: val.la_count, id: val.la_oid, name: val.la_name },
          caption: nodeLegend[labelName].caption,
        },
        classes: 'node',
      },
    );
  }
};

export const generateCytoscapeMetadataElement = (data: MetadataValue[] | null | undefined): GenerateResult => {
  const nodes: CytoscapeElement[] = [];
  const edges: CytoscapeElement[] = [];
  const nodeLegend: Record<string, LegendEntry> = {};
  const edgeLegend: Record<string, LegendEntry> = {};

  if (data) {
    data.forEach((val) => {
      if (!Object.prototype.hasOwnProperty.call(val, 'la_count')) {
        return;
      }
      if (Object.prototype.hasOwnProperty.call(val, 'la_count') && (val.la_count ?? 0) <= 0) {
        return;
      }

      const labelName = val.la_name;
      if (val.la_start && val.la_end) {
        if (!Object.prototype.hasOwnProperty.call(edgeLegend, labelName)) {
          edgeLegend[labelName] = {
            size: 15,
            caption: 'name',
            ...getEdgeColor(labelName),
          };
        }
      } else if (!Object.prototype.hasOwnProperty.call(nodeLegend, labelName)) {
        nodeLegend[labelName] = {
          size: 70,
          caption: 'name',
          ...getNodeColor(labelName),
        };
      }
      generateMetadataElements(nodeLegend, edgeLegend, nodes, edges, val);
    });
  }

  return {
    legend: {
      nodeLegend: sortByKey(nodeLegend) as Record<string, LegendEntry>,
      edgeLegend: sortByKey(edgeLegend) as Record<string, LegendEntry>,
    },
    elements: { nodes, edges },
  };
};
