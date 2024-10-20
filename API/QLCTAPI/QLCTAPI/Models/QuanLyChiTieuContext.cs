using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QLCTAPI.Models;

public partial class QuanLyChiTieuContext : DbContext
{
    public QuanLyChiTieuContext()
    {
    }

    public QuanLyChiTieuContext(DbContextOptions<QuanLyChiTieuContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CategoryDefine> CategoryDefines { get; set; }

    public virtual DbSet<CurrencyDefine> CurrencyDefines { get; set; }

    public virtual DbSet<FrequencyDefine> FrequencyDefines { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<PurposeDefine> PurposeDefines { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<TransactionImage> TransactionImages { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserCategoryCustom> UserCategoryCustoms { get; set; }

    public virtual DbSet<UserToken> UserTokens { get; set; }

    public virtual DbSet<VerifyCode> VerifyCodes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=WIN-8PMB5F2TOCE;Initial Catalog=QuanLyChiTieu;User ID=sa;Password=123456;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoryDefine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Category__3214EC2771698B02");

            entity.ToTable("CategoryDefine");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ImgSrc).IsUnicode(false);
            entity.Property(e => e.PurposeCode)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<CurrencyDefine>(entity =>
        {
            entity.HasKey(e => e.CurrencyCode).HasName("PK__Currency__408426BECB4B0424");

            entity.ToTable("CurrencyDefine");

            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.BuyRate).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.CurrencyName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.SellRate).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Symbol).HasMaxLength(5);
        });

        modelBuilder.Entity<FrequencyDefine>(entity =>
        {
            entity.HasKey(e => e.FrequencyId).HasName("PK__Frequenc__592474B87C8B5C01");

            entity.ToTable("FrequencyDefine", tb => tb.HasTrigger("trg_AutoIncrementOrderFrequency"));

            entity.Property(e => e.FrequencyId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FrequencyID");
            entity.Property(e => e.FrequencyName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Notifica__3214EC27164F3EB3");

            entity.Property(e => e.Id)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ID");
            entity.Property(e => e.DateNotificate).HasColumnType("datetime");
            entity.Property(e => e.ScheduleId).HasColumnName("ScheduleID");
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<PurposeDefine>(entity =>
        {
            entity.HasKey(e => e.Code).HasName("PK__PurposeD__A25C5AA62FA83541");

            entity.ToTable("PurposeDefine");

            entity.Property(e => e.Code)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.PurposeName).HasMaxLength(100);
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Schedule__3214EC27F8516C40");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryCustomId).HasColumnName("CategoryCustomID");
            entity.Property(e => e.FrequencyId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FrequencyID");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Money).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.Note).HasMaxLength(1024);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC274AF976D7");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryCustomId).HasColumnName("CategoryCustomID");
            entity.Property(e => e.CreateAt).HasColumnType("datetime");
            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Money).HasColumnType("decimal(18, 6)");
            entity.Property(e => e.Note).HasMaxLength(1024);
            entity.Property(e => e.Status)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasDefaultValue("P");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<TransactionImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3214EC2719D69853");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.ImgSrc).HasMaxLength(2048);
            entity.Property(e => e.TransactionId).HasColumnName("TransactionID");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC27B5B0609E");

            entity.ToTable(tb => tb.HasTrigger("trg_AfterInsertUser"));

            entity.HasIndex(e => e.Email, "UQ__Users__A9D10534C9B4A39C").IsUnique();

            entity.Property(e => e.Id)
                .HasDefaultValueSql("(newid())")
                .HasColumnName("ID");
            entity.Property(e => e.Balance)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 6)");
            entity.Property(e => e.CurrencyCode)
                .HasMaxLength(5)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(false);
            entity.Property(e => e.Name).HasMaxLength(100);
            entity.Property(e => e.NumLoginFail).HasDefaultValue(-1);
            entity.Property(e => e.Password).IsUnicode(false);
        });

        modelBuilder.Entity<UserCategoryCustom>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__User_Cat__3214EC275AA623E6");

            entity.ToTable("User_Category_Custom");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CategoryColor).HasMaxLength(20);
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(100);
            entity.Property(e => e.CategoryOrder).HasDefaultValue(9999);
            entity.Property(e => e.IsDefault).HasDefaultValue(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__UserToke__1788CCACB3FBB6D0");

            entity.Property(e => e.UserId)
                .ValueGeneratedNever()
                .HasColumnName("UserID");
            entity.Property(e => e.ExpiredDate).HasColumnType("datetime");
            entity.Property(e => e.Token).IsUnicode(false);
        });

        modelBuilder.Entity<VerifyCode>(entity =>
        {
            entity.HasKey(e => e.Email).HasName("PK__VerifyCo__A9D105354E3701BF");

            entity.ToTable("VerifyCode");

            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Code)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.ExpiredDate).HasColumnType("datetime");
            entity.Property(e => e.IsVerify).HasDefaultValue(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
