{/* AI Natijasi va Qizil Ogohlantirish */}
{result && (
  <div className="mt-6 pt-6 border-t border-border/80 space-y-4 animate-in fade-in">

    {/* AI hisoblagan narx ko'rinadigan qism */}
    <div className="p-4 rounded-xl bg-brand/10 border border-brand/50 text-center space-y-1">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase">
        Sotib olish taklifimiz:
      </span>
      <div className="text-2xl sm:text-4xl font-black text-brand tracking-tight">
        ~ {result.estimatedPriceUZS.toLocaleString("uz-UZ")} so'm
        <span className="text-xs text-muted-foreground font-normal ml-1">
          (${result.estimatedPriceUSD})
        </span>
      </div>
      <p className="text-xs text-foreground/80 pt-1 leading-relaxed">
        <strong>💡 AI Tahlili:</strong> {result.reasoning}
      </p>
    </div>

    {/* 🔴 AYNAN SHU YERGA TASHLOVSIZ: */}
    <div className="p-4 rounded-xl bg-red-950/50 border-2 border-red-500 text-red-100 space-y-2 shadow-lg shadow-red-950/40">
      <div className="flex items-center gap-2 font-black text-red-400 text-xs sm:text-sm uppercase tracking-wide">
        <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
        <span>MUHIM ESLATMA / DIQQAT QILING:</span>
      </div>
      <p className="text-xs sm:text-sm leading-relaxed font-medium">
        Ushbu ko'rsatilgan narx <strong>onlayn taxminiy baholash</strong> hisoblanadi. Telefoningizni usta ko'rmasdan va diagnostika qilmasdan turib aniq baholay olmaymiz! Shuning uchun do'konimizga kelganingizda va usta tekshiruvidan so'ng haqiqiy narxlar ushbu ko'rsatilgan summadan <strong>$100 - $150 farq qilishi</strong> (kamayishi yoki ko'payishi) mumkin.
      </p>
    </div>

  </div>
)}