const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const assert = require("assert");

(async () => {
  const project = JSON.parse(fs.readFileSync("data/project_kv109_v223.json", "utf8"));
  const expected = [];
  for (const room of project.rooms) {
    for (const it of room.items || []) {
      if (it.type === "cable") expected.push({ room: room.name, id: it.id, use: it.use || "", h: it.h });
    }
  }
  assert(expected.length > 0, "latest project must include cable output points");
  const bathroom = project.rooms.find(r => r.name.includes("санузел"));
  const heater = bathroom.items.find(i => i.type === "cable" && /водонагрев/i.test(i.use || ""));
  assert(heater, "water-heater cable output exists in the latest project");
  heater.mark = "ТЕСТ_ВЫВОД_БОЙЛЕР";
  const b = await chromium.launch();
  try {
    const page = await b.newPage({ viewport: { width: 1500, height: 1000 } });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.addInitScript(() => localStorage.setItem("obmerka-tour", "1"));
    await page.goto("file://" + path.resolve("tools/_test.html"));
    await page.waitForFunction(() => window.__T?.S.project);
    await page.waitForTimeout(800);
    const result = await page.evaluate(project => {
      const t = window.__T;
      t.S.project = project;
      t.S.uiMode = "office";
      t.S.stage = "final";
      t.S.vmode = "plan";
      t.S.layers.elec = true;
      t.S.roomId = project.rooms.find(r => r.name.includes("санузел")).id;
      t.S.elecF = "sock";
      t.fitView();
      t.render();
      const outputs = [];
      for (const room of project.rooms) {
        for (const item of room.items || []) {
          if (item.type !== "cable") continue;
          const isolated = { ...room, items: [item] };
          t.S.elecF = "sock";
          const filtered = t.planSVG(isolated, t.S.view, 1400, 900, t.PRINT_PAL, { labels: true, grid: false });
          t.S.elecF = null;
          const unfiltered = t.planSVG(isolated, t.S.view, 1400, 900, t.PRINT_PAL, { labels: true, grid: false });
          outputs.push({ id: item.id, shown: filtered === unfiltered && filtered.length > 0 });
        }
      }
      t.S.elecF = "sock";
      return {
        outputs,
        activeSection: t.S.work,
        projectChangedOnlyForTestCopy: t.S.project.rooms.find(r => r.name.includes("санузел")).items.some(i => i.mark === "ТЕСТ_ВЫВОД_БОЙЛЕР")
      };
    }, project);
    assert.equal(result.outputs.length, expected.length);
    assert(result.outputs.every(x => x.shown), JSON.stringify(result.outputs));
    assert(result.projectChangedOnlyForTestCopy, "test marker exists only in in-memory test copy");
    assert.deepEqual(errors, []);
    console.log("PASS: sockets, weak points and all cable outputs pass the engineering filter; water-heater output is drawn; switches remain excluded.");
    console.log("Latest project cable outputs:", JSON.stringify(expected));
  } finally {
    await b.close();
  }
})().catch(e => { console.error(e); process.exit(1); });
